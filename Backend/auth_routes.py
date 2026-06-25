"""Authentication routes for the construction monitoring demo app.

This module exposes a small Flask blueprint that can be registered by the
application entrypoint. It keeps the auth flow intentionally lightweight while
supporting account creation, OTP verification, and identifier-based login.

Expected usage:

	from flask import Flask
	from Backend.auth_routes import auth_bp

	app = Flask(__name__)
	app.register_blueprint(auth_bp, url_prefix="/api/auth")
"""

from __future__ import annotations

import json
import logging
import os
import random
import smtplib
import base64
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from pathlib import Path
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request
from typing import Any, Dict, Optional
from uuid import uuid4

try:
	from flask import Blueprint, jsonify, request
except ImportError as exc:  # pragma: no cover - keeps the module importable for docs/tests
	raise ImportError(
		"Flask is required to use auth_routes.py. Install flask and register the blueprint in your app."
	) from exc


logger = logging.getLogger(__name__)


@dataclass
class DemoUser:
	id: int
	name: str
	email: str
	pin: str
	role: str
	type: str
	location: str
	mobile: str = ""
	verified: bool = True
	otp: str = ""
	otp_expires_at: str = ""


auth_bp = Blueprint("auth", __name__)

AUTH_USERS_STORE = Path(__file__).with_name("auth_users.json")


def _default_demo_users() -> list[DemoUser]:
	return [
		DemoUser(1, "Faizan Rahim", "faizan@gmail.com", "12345", "Site Supervisor", "supervisor", "Gilgit, PK"),
		DemoUser(2, "Farhan Ali", "farhan@gmail.com", "2468", "Field Supervisor", "supervisor", "Gilgit, PK"),
		DemoUser(3, "Eng. Amjad Hanif", "amjad@gmail.com", "3456", "QA Supervisor", "supervisor", "Gilgit, PK"),
		DemoUser(4, "Gilgit Contractors", "contractor@gilgit.com", "9999", "Main Contractor", "contractor", "Gilgit, PK"),
		DemoUser(5, "Adeel Hussain", "engineer@gilgit.com", "4567", "Project Engineer", "engineer", "Gilgit, PK"),
		DemoUser(6, "Nadia Shah", "client@gilgit.com", "8888", "Client Representative", "client", "Islamabad, PK"),
		DemoUser(7, "Stakeholder Group", "stakeholder@gilgit.com", "7777", "Stakeholder", "stakeholder", "Karachi, PK"),
	]


def _user_to_payload(user: DemoUser) -> Dict[str, Any]:
	return asdict(user)


def _user_from_payload(payload: Dict[str, Any]) -> DemoUser:
	return DemoUser(
		id=int(payload.get("id", 0)),
		name=str(payload.get("name", "")).strip(),
		email=str(payload.get("email", "")).strip(),
		pin=str(payload.get("pin", "")).strip(),
		role=str(payload.get("role", "")).strip(),
		type=str(payload.get("type", "")).strip(),
		location=str(payload.get("location", "")).strip(),
		mobile=str(payload.get("mobile", "")).strip(),
		verified=bool(payload.get("verified", True)),
		otp=str(payload.get("otp", "")).strip(),
		otp_expires_at=str(payload.get("otp_expires_at", "")).strip(),
	)


def _load_users() -> list[DemoUser]:
	if not AUTH_USERS_STORE.exists():
		return _default_demo_users()
	try:
		data = json.loads(AUTH_USERS_STORE.read_text(encoding="utf-8"))
		if isinstance(data, list) and data:
			return [_user_from_payload(item) for item in data if isinstance(item, dict)]
	except Exception as exc:  # pragma: no cover - file corruption or encoding issues
		logger.warning("Falling back to default auth users after load failure: %s", exc)
	return _default_demo_users()


def _save_users() -> None:
	AUTH_USERS_STORE.write_text(
		json.dumps([_user_to_payload(user) for user in DEMO_USERS], indent=2),
		encoding="utf-8",
	)


DEMO_USERS = _load_users()


def _serialize_user(user: DemoUser) -> Dict[str, Any]:
	payload = asdict(user)
	payload.pop("pin", None)
	payload.pop("otp", None)
	payload.pop("otp_expires_at", None)
	return payload


def _normalize_identifier(identifier: str) -> str:
	return identifier.strip().lower()


def _is_email(identifier: str) -> bool:
	return "@" in identifier


def _is_mobile(identifier: str) -> bool:
	filtered = identifier.replace(" ", "").replace("-", "").replace("+", "")
	return bool(filtered) and filtered.isdigit()


def _normalize_phone_number(phone_number: str) -> str:
	value = str(phone_number).strip()
	if not value:
		return ""
	if value.startswith("+"):
		return "+" + "".join(character for character in value if character.isdigit())
	digits = "".join(character for character in value if character.isdigit())
	if digits.startswith("00"):
		digits = digits[2:]
	if len(digits) == 11 and digits.startswith("0"):
		digits = digits[1:]
	country_code = os.getenv("DEFAULT_PHONE_COUNTRY_CODE", "+92").strip() or "+92"
	country_digits = "".join(character for character in country_code if character.isdigit())
	if country_digits and not digits.startswith(country_digits):
		digits = f"{country_digits}{digits}"
	return f"+{digits}"


def _twilio_configured() -> bool:
	return bool(os.getenv("TWILIO_ACCOUNT_SID", "").strip() and os.getenv("TWILIO_AUTH_TOKEN", ""))


def _send_twilio_message(to_number: str, from_number: str, body: str) -> Dict[str, Any]:
	account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
	auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
	if not account_sid or not auth_token:
		return {"sent": False, "channel": "dev", "reason": "twilio_not_configured"}

	endpoint = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
	payload = urllib_parse.urlencode({"To": to_number, "From": from_number, "Body": body}).encode("utf-8")
	credentials = base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("ascii")
	request = urllib_request.Request(
		endpoint,
		data=payload,
		headers={
			"Authorization": f"Basic {credentials}",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method="POST",
	)
	try:
		with urllib_request.urlopen(request, timeout=15) as response:
			response_body = response.read().decode("utf-8")
			return {"sent": True, "channel": "twilio", "status": response.status, "response": response_body}
	except urllib_error.HTTPError as exc:
		return {"sent": False, "channel": "twilio", "status": exc.code, "error": exc.read().decode("utf-8", errors="ignore")}
	except Exception as exc:  # pragma: no cover - network/provider dependent
		return {"sent": False, "channel": "twilio", "error": str(exc)}


def _next_user_id() -> int:
	return max((user.id for user in DEMO_USERS), default=0) + 1


def _find_user(identifier: str) -> Optional[DemoUser]:
	if not identifier:
		return None
	normalized_identifier = _normalize_identifier(identifier)
	for user in DEMO_USERS:
		if user.email and user.email.lower() == normalized_identifier:
			return user
		if user.mobile and user.mobile.lower() == normalized_identifier:
			return user
	return None


def find_user_by_email(email: str) -> Optional[DemoUser]:
	return _find_user(email)


def authenticate_user(identifier: str, password: str) -> Optional[DemoUser]:
	user = _find_user(identifier)
	if not user or not user.verified:
		return None
	if user.pin != password.strip():
		return None
	return user


def _otp_expiry() -> str:
	return (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()


def _otp_is_valid(user: DemoUser, otp: str) -> bool:
	if not user.otp or user.otp != otp.strip():
		return False
	if not user.otp_expires_at:
		return False
	try:
		expiry = datetime.fromisoformat(user.otp_expires_at)
	except ValueError:
		return False
	return expiry >= datetime.now(timezone.utc)


def _build_otp_email(user: DemoUser, otp: str) -> EmailMessage:
	message = EmailMessage()
	message["Subject"] = "Your OCPMS verification code"
	message["From"] = os.getenv("SMTP_FROM_EMAIL", os.getenv("SMTP_USERNAME", "noreply@ocpms.local"))
	message["To"] = user.email
	message.set_content(
		f"""
Hello {user.name},

Your OCPMS verification code is: {otp}

This code expires in 15 minutes.
If you did not create this account, you can ignore this email.
""".strip()
	)
	return message


def _send_verification_email(user: DemoUser, otp: str) -> Dict[str, Any]:
	host = os.getenv("SMTP_HOST", "").strip()
	port = int(os.getenv("SMTP_PORT", "587"))
	username = os.getenv("SMTP_USERNAME", "").strip()
	password = os.getenv("SMTP_PASSWORD", "")
	use_tls = os.getenv("SMTP_USE_TLS", "true").strip().lower() != "false"
	use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().lower() == "true"

	if not host:
		logger.info("SMTP not configured; OTP for %s is %s", user.email, otp)
		return {"sent": False, "channel": "dev"}

	message = _build_otp_email(user, otp)
	try:
		if use_ssl:
			with smtplib.SMTP_SSL(host, port, timeout=10) as smtp:
				if username:
					smtp.login(username, password)
				smtp.send_message(message)
		else:
			with smtplib.SMTP(host, port, timeout=10) as smtp:
				if use_tls:
					smtp.starttls()
				if username:
					smtp.login(username, password)
				smtp.send_message(message)
		return {"sent": True, "channel": "email"}
	except Exception as exc:  # pragma: no cover - network and provider dependent
		logger.exception("Failed to send verification email to %s", user.email)
		return {"sent": False, "channel": "email", "error": str(exc)}


def _send_verification_sms(user: DemoUser, otp: str) -> Dict[str, Any]:
	phone_number = _normalize_phone_number(user.mobile)
	if not phone_number:
		return {"sent": False, "channel": "sms", "error": "Mobile number is required for SMS OTP."}
	message = f"Your OCPMS verification code is {otp}. It expires in 15 minutes."
	sender = os.getenv("TWILIO_SMS_FROM_NUMBER", "").strip()
	if not sender:
		return {"sent": False, "channel": "dev", "reason": "sms_sender_not_configured"}
	if not sender.startswith("+"):
		sender = _normalize_phone_number(sender)
	return _send_twilio_message(phone_number, sender, message)


def _send_verification_whatsapp(user: DemoUser, otp: str) -> Dict[str, Any]:
	phone_number = _normalize_phone_number(user.mobile)
	if not phone_number:
		return {"sent": False, "channel": "whatsapp", "error": "Mobile number is required for WhatsApp OTP."}
	message = f"Your OCPMS verification code is {otp}. It expires in 15 minutes."
	sender = os.getenv("TWILIO_WHATSAPP_FROM", os.getenv("TWILIO_SMS_FROM_NUMBER", "")).strip()
	if not sender:
		return {"sent": False, "channel": "dev", "reason": "whatsapp_sender_not_configured"}
	if not sender.startswith("whatsapp:"):
		sender_number = sender if sender.startswith("+") else _normalize_phone_number(sender)
		sender = f"whatsapp:{sender_number}"
	return _send_twilio_message(f"whatsapp:{phone_number}", sender, message)


def _register_user(payload: Dict[str, Any]) -> Dict[str, Any]:
	name = str(payload.get("name", "")).strip()
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	email = str(payload.get("email", "")).strip()
	mobile = str(payload.get("mobile", "")).strip()
	password = str(payload.get("password", payload.get("pin", ""))).strip()
	confirm_password = str(payload.get("confirmPassword", payload.get("confirm_password", ""))).strip()
	role = str(payload.get("role", "New User")).strip() or "New User"
	location = str(payload.get("location", "")).strip() or "Pakistan"
	delivery_method = str(payload.get("deliveryMethod", payload.get("delivery_method", "email"))).strip().lower() or "email"
	if delivery_method not in {"email", "sms", "whatsapp"}:
		raise ValueError("Delivery method must be email, sms, or whatsapp.")

	if not name:
		raise ValueError("Name is required.")
	if not identifier:
		raise ValueError("Email or mobile number is required.")
	if not password:
		raise ValueError("Password is required.")
	if confirm_password and confirm_password != password:
		raise ValueError("Passwords do not match.")

	if _is_email(identifier):
		if not email:
			email = identifier
		if delivery_method in {"sms", "whatsapp"}:
			raise ValueError("SMS and WhatsApp OTP require a mobile number as the account identifier.")
	else:
		if not _is_mobile(identifier):
			raise ValueError("Use a valid email address or mobile number as the account identifier.")
		mobile = identifier
		if delivery_method == "email" and not email:
			raise ValueError("Email is required when using email OTP for a mobile signup.")
		if delivery_method in {"sms", "whatsapp"} and not mobile:
			raise ValueError("Mobile number is required for SMS or WhatsApp OTP.")

	if _find_user(identifier) or (email and _find_user(email)) or (mobile and _find_user(mobile)):
		raise ValueError("An account already exists for that email or mobile number.")

	otp = f"{random.randint(0, 999999):06d}"
	user = DemoUser(
		id=_next_user_id(),
		name=name,
		email=email,
		pin=password,
		role=role,
		type=str(payload.get("type", "user")).strip() or "user",
		location=location,
		mobile=mobile,
		verified=False,
		otp=otp,
		otp_expires_at=_otp_expiry(),
	)
	DEMO_USERS.append(user)
	_save_users()
	if delivery_method == "sms":
		delivery = _send_verification_sms(user, otp)
	elif delivery_method == "whatsapp":
		delivery = _send_verification_whatsapp(user, otp)
	else:
		delivery = _send_verification_email(user, otp)
	delivery["method"] = delivery_method
	return {"user": user, "delivery": delivery, "otp": otp}


def _resend_otp_for_user(user: DemoUser, delivery_method: str) -> Dict[str, Any]:
	otp = f"{random.randint(0, 999999):06d}"
	user.verified = False
	user.otp = otp
	user.otp_expires_at = _otp_expiry()
	_save_users()
	if delivery_method == "sms":
		delivery = _send_verification_sms(user, otp)
	elif delivery_method == "whatsapp":
		delivery = _send_verification_whatsapp(user, otp)
	else:
		delivery = _send_verification_email(user, otp)
	delivery["method"] = delivery_method
	return {"otp": otp, "delivery": delivery}


def _resend_otp(payload: Dict[str, Any]) -> Dict[str, Any]:
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	delivery_method = str(payload.get("deliveryMethod", payload.get("delivery_method", ""))).strip().lower()
	user = _find_user(identifier)
	if not user:
		raise ValueError("Account not found.")

	if user.verified:
		raise ValueError("Account is already verified.")

	if delivery_method and delivery_method not in {"email", "sms", "whatsapp"}:
		raise ValueError("Delivery method must be email, sms, or whatsapp.")

	if not delivery_method:
		if user.mobile and not user.email:
			delivery_method = "sms"
		elif user.mobile and user.email:
			delivery_method = "sms"
		else:
			delivery_method = "email"

	otp = f"{random.randint(0, 999999):06d}"
	user.otp = otp
	user.otp_expires_at = _otp_expiry()
	_save_users()

	if delivery_method == "sms":
		delivery = _send_verification_sms(user, otp)
	elif delivery_method == "whatsapp":
		delivery = _send_verification_whatsapp(user, otp)
	else:
		delivery = _send_verification_email(user, otp)

	delivery["method"] = delivery_method
	return {"user": user, "delivery": delivery, "otp": otp}


def create_session_token(user: DemoUser) -> str:
	return f"demo-{user.id}-{uuid4().hex}"


@auth_bp.get("/health")
def health_check():
	return jsonify({"status": "ok", "service": "auth"})


@auth_bp.get("/users")
def list_users():
	return jsonify({"users": [_serialize_user(user) for user in DEMO_USERS]})


@auth_bp.post("/register")
@auth_bp.post("/signup")
def register():
	payload = request.get_json(silent=True) or {}
	try:
		result = _register_user(payload)
	except ValueError as exc:
		return jsonify({"error": str(exc)}), 400

	response = {
		"message": "Account created. Check your OTP delivery channel and verify your account.",
		"user": _serialize_user(result["user"]),
		"delivery": result["delivery"],
		"verification_required": True,
	}
	if not result["delivery"].get("sent"):
		response["dev_otp"] = result["otp"]
		response["warning"] = "OTP provider is not configured, so the OTP is available in the response for demo testing."
	return jsonify(response), 201


@auth_bp.post("/verify-otp")
def verify_otp():
	payload = request.get_json(silent=True) or {}
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	otp = str(payload.get("otp", "")).strip()

	if not identifier or not otp:
		return jsonify({"error": "Identifier and OTP are required."}), 400

	user = _find_user(identifier)
	if not user:
		return jsonify({"error": "Account not found."}), 404
	if not _otp_is_valid(user, otp):
		if user.otp and otp and user.otp != otp:
			return jsonify({"error": "Invalid OTP. Use the latest code sent to your chosen channel."}), 400
		return jsonify({"error": "OTP expired. Create the account again or add a resend flow."}), 400

	user.verified = True
	user.otp = ""
	user.otp_expires_at = ""
	_save_users()
	token = create_session_token(user)
	return jsonify({"message": "Account verified successfully.", "token": token, "user": _serialize_user(user)})


@auth_bp.post("/resend-otp")
def resend_otp():
	payload = request.get_json(silent=True) or {}
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	delivery_method = str(payload.get("deliveryMethod", payload.get("delivery_method", "email"))).strip().lower() or "email"

	if not identifier:
		return jsonify({"error": "Identifier is required."}), 400
	if delivery_method not in {"email", "sms", "whatsapp"}:
		return jsonify({"error": "Delivery method must be email, sms, or whatsapp."}), 400

	user = _find_user(identifier)
	if not user:
		return jsonify({"error": "Account not found."}), 404
	if user.verified:
		return jsonify({"error": "Account is already verified."}), 400

	result = _resend_otp_for_user(user, delivery_method)
	response = {
		"message": "A new OTP has been sent.",
		"delivery": result["delivery"],
		"user": _serialize_user(user),
	}
	if not result["delivery"].get("sent"):
		response["dev_otp"] = result["otp"]
		response["warning"] = "OTP provider is not configured, so the OTP is available in the response for demo testing."
	return jsonify(response)


@auth_bp.post("/login")
def login():
	payload = request.get_json(silent=True) or {}
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	password = str(payload.get("password", payload.get("pin", ""))).strip()

	if not identifier or not password:
		return jsonify({"error": "Email or mobile number and password are required."}), 400

	user = authenticate_user(identifier, password)
	if not user:
		pending_user = _find_user(identifier)
		if pending_user and not pending_user.verified:
			return jsonify({"error": "Account is not verified yet. Check your email for the OTP."}), 403
		return jsonify({"error": "Invalid email/mobile or password."}), 401

	token = create_session_token(user)
	return jsonify(
		{
			"message": "Login successful.",
			"token": token,
			"user": _serialize_user(user),
		}
	)


@auth_bp.post("/validate")
def validate_login():
	payload = request.get_json(silent=True) or {}
	identifier = str(payload.get("identifier", payload.get("email", payload.get("mobile", "")))).strip()
	password = str(payload.get("password", payload.get("pin", ""))).strip()
	user = authenticate_user(identifier, password)
	return jsonify({"valid": user is not None, "user": _serialize_user(user) if user else None})


@auth_bp.get("/me")
def current_user():
	identifier = request.args.get("identifier", request.args.get("email", request.args.get("mobile", ""))).strip()
	user = _find_user(identifier)
	if not user:
		return jsonify({"error": "User not found."}), 404
	return jsonify({"user": _serialize_user(user)})

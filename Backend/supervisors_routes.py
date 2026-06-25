from __future__ import annotations

from flask import Blueprint, jsonify

from auth_routes import DEMO_USERS


supervisors_bp = Blueprint("supervisors", __name__)


@supervisors_bp.get("")
def list_supervisors():
    supervisors = [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "location": user.location,
        }
        for user in DEMO_USERS
        if user.type == "supervisor"
    ]
    return jsonify({"supervisors": supervisors})

from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import NOTIFICATIONS, clone_rows, find_by_id, next_id


notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("")
def list_notifications():
    return jsonify({"notifications": clone_rows(NOTIFICATIONS)})


@notifications_bp.post("")
def create_notification():
    payload = request.get_json(silent=True) or {}
    notification = {
        "id": next_id(NOTIFICATIONS),
        "title": str(payload.get("title", "New notification")).strip(),
        "meta": str(payload.get("meta", "")).strip(),
        "tone": str(payload.get("tone", "info")).strip(),
        "read": bool(payload.get("read", False)),
    }
    NOTIFICATIONS.insert(0, notification)
    return jsonify({"notification": notification}), 201


@notifications_bp.patch("/<int:notification_id>")
def update_notification(notification_id: int):
    notification = find_by_id(NOTIFICATIONS, notification_id)
    if not notification:
        return jsonify({"error": "Notification not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["title", "meta", "tone", "read"]:
        if key in payload:
            notification[key] = payload[key]
    return jsonify({"notification": notification})


@notifications_bp.delete("/<int:notification_id>")
def delete_notification(notification_id: int):
    notification = find_by_id(NOTIFICATIONS, notification_id)
    if not notification:
        return jsonify({"error": "Notification not found."}), 404
    NOTIFICATIONS.remove(notification)
    return jsonify({"deleted": True, "id": notification_id})

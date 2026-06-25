from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import UPDATES, clone_rows, find_by_id, iso_now, next_id


updates_bp = Blueprint("updates", __name__)


@updates_bp.get("")
def list_updates():
    return jsonify({"updates": clone_rows(UPDATES)})


@updates_bp.post("")
def create_update():
    payload = request.get_json(silent=True) or {}
    update = {
        "id": next_id(UPDATES),
        "project": str(payload.get("project", "Unnamed Project")).strip(),
        "supervisor": str(payload.get("supervisor", "Supervisor")).strip(),
        "date": str(payload.get("date", iso_now())).strip(),
        "summary": str(payload.get("summary", "")).strip(),
        "risks": str(payload.get("risks", "No blockers reported.")).strip(),
        "contractor": str(payload.get("contractor", "Main Contractor")).strip(),
    }
    UPDATES.insert(0, update)
    return jsonify({"update": update}), 201


@updates_bp.patch("/<int:update_id>")
def update_update(update_id: int):
    update = find_by_id(UPDATES, update_id)
    if not update:
        return jsonify({"error": "Update not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["project", "supervisor", "date", "summary", "risks", "contractor"]:
        if key in payload:
            update[key] = payload[key]
    return jsonify({"update": update})


@updates_bp.delete("/<int:update_id>")
def delete_update(update_id: int):
    update = find_by_id(UPDATES, update_id)
    if not update:
        return jsonify({"error": "Update not found."}), 404
    UPDATES.remove(update)
    return jsonify({"deleted": True, "id": update_id})

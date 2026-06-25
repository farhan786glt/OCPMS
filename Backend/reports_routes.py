from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import REPORTS, clone_rows, find_by_id, next_id


reports_bp = Blueprint("reports", __name__)


@reports_bp.get("")
def list_reports():
    return jsonify({"reports": clone_rows(REPORTS)})


@reports_bp.post("")
def create_report():
    payload = request.get_json(silent=True) or {}
    report = {
        "id": next_id(REPORTS),
        "zone": str(payload.get("zone", "Unknown Zone")).strip(),
        "updated_at": str(payload.get("updated_at", "")).strip(),
        "media": str(payload.get("media", "")).strip(),
        "status": str(payload.get("status", "Draft")).strip(),
    }
    REPORTS.insert(0, report)
    return jsonify({"report": report}), 201


@reports_bp.patch("/<int:report_id>")
def update_report(report_id: int):
    report = find_by_id(REPORTS, report_id)
    if not report:
        return jsonify({"error": "Report not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["zone", "updated_at", "media", "status"]:
        if key in payload:
            report[key] = payload[key]
    return jsonify({"report": report})


@reports_bp.delete("/<int:report_id>")
def delete_report(report_id: int):
    report = find_by_id(REPORTS, report_id)
    if not report:
        return jsonify({"error": "Report not found."}), 404
    REPORTS.remove(report)
    return jsonify({"deleted": True, "id": report_id})

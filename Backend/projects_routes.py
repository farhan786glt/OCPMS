from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import PROJECTS, clone_rows, find_by_id, next_id


projects_bp = Blueprint("projects", __name__)


@projects_bp.get("")
def list_projects():
    return jsonify({"projects": clone_rows(PROJECTS)})


@projects_bp.get("/<int:project_id>")
def get_project(project_id: int):
    project = find_by_id(PROJECTS, project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify({"project": project})


@projects_bp.post("")
def create_project():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip() or "New Project"
    project = {
        "id": next_id(PROJECTS),
        "name": name,
        "progress": int(payload.get("progress", 0)),
        "status": str(payload.get("status", "Planning")),
        "budget": str(payload.get("budget", "0 Cr")),
        "location": str(payload.get("location", "Unknown")),
        "deadline": str(payload.get("deadline", "")),
        "contractor": str(payload.get("contractor", "Unassigned")),
        "description": str(payload.get("description", "")),
    }
    PROJECTS.insert(0, project)
    return jsonify({"project": project}), 201


@projects_bp.patch("/<int:project_id>")
def update_project(project_id: int):
    project = find_by_id(PROJECTS, project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["name", "progress", "status", "budget", "location", "deadline", "contractor", "description"]:
        if key in payload:
            project[key] = payload[key]
    return jsonify({"project": project})


@projects_bp.delete("/<int:project_id>")
def delete_project(project_id: int):
    project = find_by_id(PROJECTS, project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    PROJECTS.remove(project)
    return jsonify({"deleted": True, "id": project_id})

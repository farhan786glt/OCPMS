from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import TASKS, clone_rows, find_by_id, next_id


tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("")
def list_tasks():
    return jsonify({"tasks": clone_rows(TASKS)})


@tasks_bp.post("")
def create_task():
    payload = request.get_json(silent=True) or {}
    task = {
        "id": next_id(TASKS),
        "title": str(payload.get("title", "New Task")).strip(),
        "owner": str(payload.get("owner", "Unassigned")).strip(),
        "due": str(payload.get("due", "")).strip(),
        "priority": str(payload.get("priority", "medium")).strip(),
        "status": str(payload.get("status", "Backlog")).strip(),
    }
    TASKS.insert(0, task)
    return jsonify({"task": task}), 201


@tasks_bp.patch("/<int:task_id>")
def update_task(task_id: int):
    task = find_by_id(TASKS, task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["title", "owner", "due", "priority", "status"]:
        if key in payload:
            task[key] = payload[key]
    return jsonify({"task": task})


@tasks_bp.delete("/<int:task_id>")
def delete_task(task_id: int):
    task = find_by_id(TASKS, task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    TASKS.remove(task)
    return jsonify({"deleted": True, "id": task_id})

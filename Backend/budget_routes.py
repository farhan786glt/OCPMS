from __future__ import annotations

from flask import Blueprint, jsonify

from data_store import BUDGET, PROJECTS, TASKS


budget_bp = Blueprint("budget", __name__)


@budget_bp.get("")
def get_budget_summary():
    return jsonify(
        {
            "budget": BUDGET,
            "projectCount": len(PROJECTS),
            "taskCount": len(TASKS),
        }
    )

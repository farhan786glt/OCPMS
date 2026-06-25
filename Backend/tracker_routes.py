from __future__ import annotations

from flask import Blueprint, jsonify

from data_store import MILESTONES, clone_rows


tracker_bp = Blueprint("tracker", __name__)


@tracker_bp.get("")
def list_milestones():
    return jsonify({"milestones": clone_rows(MILESTONES)})

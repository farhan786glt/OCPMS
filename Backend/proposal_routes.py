from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import PROPOSAL


proposal_bp = Blueprint("proposal", __name__)


@proposal_bp.get("")
def get_proposal():
    return jsonify({"proposal": PROPOSAL})


@proposal_bp.patch("")
def update_proposal():
    payload = request.get_json(silent=True) or {}
    if "title" in payload:
        PROPOSAL["title"] = payload["title"]
    if "summary" in payload:
        PROPOSAL["summary"] = payload["summary"]
    if "sections" in payload and isinstance(payload["sections"], list):
        PROPOSAL["sections"] = payload["sections"]
    return jsonify({"proposal": PROPOSAL})

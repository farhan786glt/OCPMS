from __future__ import annotations

from flask import Blueprint, jsonify

from data_store import CLIENTS, clone_rows


clients_bp = Blueprint("clients", __name__)


@clients_bp.get("")
def list_clients():
    return jsonify({"clients": clone_rows(CLIENTS)})

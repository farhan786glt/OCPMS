from __future__ import annotations

from flask import Blueprint, jsonify, request

from data_store import DOCUMENTS, clone_rows, find_by_id, next_id


documents_bp = Blueprint("documents", __name__)


@documents_bp.get("")
def list_documents():
    return jsonify({"documents": clone_rows(DOCUMENTS)})


@documents_bp.post("")
def create_document():
    payload = request.get_json(silent=True) or {}
    document = {
        "id": next_id(DOCUMENTS),
        "title": str(payload.get("title", "Untitled Document")).strip(),
        "category": str(payload.get("category", "General")).strip(),
        "updated_at": str(payload.get("updated_at", "")).strip(),
        "status": str(payload.get("status", "Draft")).strip(),
        "file_name": str(payload.get("file_name", "" )).strip(),
    }
    DOCUMENTS.insert(0, document)
    return jsonify({"document": document}), 201


@documents_bp.patch("/<int:document_id>")
def update_document(document_id: int):
    document = find_by_id(DOCUMENTS, document_id)
    if not document:
        return jsonify({"error": "Document not found."}), 404
    payload = request.get_json(silent=True) or {}
    for key in ["title", "category", "updated_at", "status", "file_name"]:
        if key in payload:
            document[key] = payload[key]
    return jsonify({"document": document})


@documents_bp.delete("/<int:document_id>")
def delete_document(document_id: int):
    document = find_by_id(DOCUMENTS, document_id)
    if not document:
        return jsonify({"error": "Document not found."}), 404
    DOCUMENTS.remove(document)
    return jsonify({"deleted": True, "id": document_id})

"""Flask application entrypoint for the construction monitoring demo backend."""

from __future__ import annotations

from flask import Flask, jsonify

try:
    from .auth_routes import auth_bp
    from .budget_routes import budget_bp
    from .clients_routes import clients_bp
    from .dashboard_routes import dashboard_bp
    from .documents_routes import documents_bp
    from .notifications_routes import notifications_bp
    from .projects_routes import projects_bp
    from .proposal_routes import proposal_bp
    from .reports_routes import reports_bp
    from .supervisors_routes import supervisors_bp
    from .tasks_routes import tasks_bp
    from .tracker_routes import tracker_bp
    from .updates_routes import updates_bp
except ImportError:  # pragma: no cover - supports direct execution from this folder
    from auth_routes import auth_bp
    from budget_routes import budget_bp
    from clients_routes import clients_bp
    from dashboard_routes import dashboard_bp
    from documents_routes import documents_bp
    from notifications_routes import notifications_bp
    from projects_routes import projects_bp
    from proposal_routes import proposal_bp
    from reports_routes import reports_bp
    from supervisors_routes import supervisors_bp
    from tasks_routes import tasks_bp
    from tracker_routes import tracker_bp
    from updates_routes import updates_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(tracker_bp, url_prefix="/api/tracker")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(budget_bp, url_prefix="/api/budget")
    app.register_blueprint(updates_bp, url_prefix="/api/updates")
    app.register_blueprint(documents_bp, url_prefix="/api/documents")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(clients_bp, url_prefix="/api/clients")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(supervisors_bp, url_prefix="/api/supervisors")
    app.register_blueprint(proposal_bp, url_prefix="/api/proposal")

    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok", "service": "construction-monitoring-backend"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
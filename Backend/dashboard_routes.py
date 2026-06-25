from __future__ import annotations

from flask import Blueprint, jsonify

from data_store import BUDGET, MILESTONES, NOTIFICATIONS, PROJECTS, TASKS, UPDATES


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("")
def get_dashboard_summary():
    open_tasks = [task for task in TASKS if task["status"] != "Done"]
    active_projects = [project for project in PROJECTS if project["status"] not in {"Complete", "Closed"}]
    unread_notifications = [item for item in NOTIFICATIONS if not item.get("read")]

    return jsonify(
        {
            "kpi": {
                "activeProjects": len(active_projects),
                "tasksDue": len(open_tasks),
                "budgetVariance": BUDGET["variance"],
                "sitePhotos": BUDGET["sitePhotos"],
            },
            "recentProjects": PROJECTS[:3],
            "recentTasks": TASKS[:4],
            "recentUpdates": UPDATES[:2],
            "milestones": MILESTONES,
            "notifications": unread_notifications,
            "budget": BUDGET,
        }
    )

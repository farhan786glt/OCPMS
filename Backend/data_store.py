"""Shared in-memory data store for the demo backend."""

from __future__ import annotations

from copy import deepcopy
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from auth_routes import DEMO_USERS


PROJECTS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Gilgit Riverside Promenade",
        "progress": 68,
        "status": "On Track",
        "budget": "2.7 Cr",
        "location": "Gilgit, PK",
        "deadline": "Dec 15, 2026",
        "contractor": "A&SCC",
        "description": "Waterfront promenade package with retaining wall and footpath works.",
    },
    {
        "id": 2,
        "name": "New academic block KIU",
        "progress": 100,
        "status": "Completed",
        "budget": "4 Cr",
        "location": "KIU, Gilgit, PK",
        "deadline": "Mar 08, 2022",
        "contractor": "A&SCC",
        "description": "Major corridor development with road base, drainage, and utility relocation.",
    },
    {
        "id": 3,
        "name": " Ansar Madni House",
        "progress": 100,
        "status": "Completed",
        "budget": "2 Cr",
        "location": "Nomal, Gilgit, PK",
        "deadline": "Dec 15, 2022",
        "contractor": "A&SCC",
        "description": "Residential villa package with finishes and handover snagging.",
    },
    {
        "id": 4,
        "name": "Link road to Amjad Advocate's House",
        "progress": 55,
        "status": "Mobilization",
        "budget": "5.3 Cr",
        "location": "Amphary, Gilgit, PK",
        "deadline": "Apr 10, 2027",
        "contractor": "A&SCC",
        "description": "Connecting road from Amjad Advocate's house to river view road with land Compensation and retaining wall works.",
    },
]

TASKS: List[Dict[str, Any]] = [
    {"id": 1, "title": "MEP inspection and compliance", "owner": "Eng. Qasim", "due": "May 22", "priority": "high", "status": "Backlog"},
    {"id": 2, "title": "Concrete pour approval", "owner": "Sana Malik", "due": "May 18", "priority": "medium", "status": "In Progress"},
    {"id": 3, "title": "Facade mockup sign-off", "owner": "Faizan Rahim", "due": "May 16", "priority": "high", "status": "Review"},
    {"id": 4, "title": "Steel delivery schedule update", "owner": "Procurement", "due": "May 19", "priority": "low", "status": "Backlog"},
    {"id": 5, "title": "Basement waterproofing QA", "owner": "QA Team", "due": "May 27", "priority": "medium", "status": "In Progress"},
    {"id": 6, "title": "Client walkthrough prep", "owner": "PMO", "due": "May 25", "priority": "medium", "status": "Done"},
]

UPDATES: List[Dict[str, Any]] = [
    {
        "id": 1,
        "project": "Gilgit Riverside Promenade",
        "supervisor": "Faizan Rahim",
        "date": "May 14, 2026",
        "summary": "Retaining wall reinforcement completed for Zone B; drainage testing started.",
        "risks": "Pending aggregate delivery could delay footpath pour by 1 day.",
        "contractor": "Gilgit Contractors",
    },
    {
        "id": 2,
        "project": "Gilgit Civic Hospital Upgrade",
        "supervisor": "Johar Ali",
        "date": "May 14, 2026",
        "summary": "MEP routing approved for Level 2; duct installation in progress.",
        "risks": "Awaiting client sign-off for fire panel relocation.",
        "contractor": "Gilgit Contractors",
    },
]

MILESTONES: List[Dict[str, Any]] = [
    {"id": 1, "title": "Site mobilization", "owner": "Project Engineer", "status": "Done", "progress": 100, "date": "Apr 10, 2026"},
    {"id": 2, "title": "Foundation works", "owner": "QA Supervisor", "status": "Done", "progress": 100, "date": "Apr 28, 2026"},
    {"id": 3, "title": "Superstructure phase", "owner": "Field Supervisor", "status": "In Progress", "progress": 67, "date": "Jun 05, 2026"},
    {"id": 4, "title": "MEP rough-in", "owner": "QA Supervisor", "status": "Planned", "progress": 18, "date": "Jun 20, 2026"},
]

BUDGET = {
    "overall": "14 Cr",
    "committed": "10.78 Cr",
    "variance": "-4%",
    "unassigned": "3.2 Cr",
    "sitePhotos": 184,
}

DOCUMENTS: List[Dict[str, Any]] = [
    {"id": 1, "title": "Contract Package A", "category": "Legal", "updated_at": "May 12, 2026", "status": "Approved", "file_name": "contract-package-a.pdf"},
    {"id": 2, "title": "Structural Drawing Set", "category": "Drawings", "updated_at": "May 13, 2026", "status": "In Review", "file_name": "structural-drawings.zip"},
    {"id": 3, "title": "Daily Site Log", "category": "Daily Report", "updated_at": "May 14, 2026", "status": "Filed", "file_name": "daily-site-log.docx"},
]

REPORTS: List[Dict[str, Any]] = [
    {"id": 1, "zone": "Zone A", "updated_at": "May 14, 2026", "media": "site-photo-zone-a.jpg", "status": "Complete"},
    {"id": 2, "zone": "Zone B", "updated_at": "May 14, 2026", "media": "drone-pass-zone-b.mp4", "status": "In Review"},
]

NOTIFICATIONS: List[Dict[str, Any]] = [
    {"id": 1, "title": "Inspection scheduled", "meta": "Today, 09:00", "tone": "info", "read": False},
    {"id": 2, "title": "Budget variance updated", "meta": "Today, 11:30", "tone": "warning", "read": False},
    {"id": 3, "title": "Document approved", "meta": "Yesterday", "tone": "success", "read": True},
]

CLIENTS: List[Dict[str, Any]] = [
    {"id": 1, "name": "Nadia Shah", "company": "Gilgit Development Authority", "email": "client@gilgit.com", "role": "Client Representative", "status": "Active"},
    {"id": 2, "name": "Stakeholder Group", "company": "Investor Panel", "email": "stakeholder@gilgit.com", "role": "Stakeholder", "status": "Active"},
]

PROPOSAL = {
    "title": "Construction Monitoring and Reporting Proposal",
    "summary": "A unified proposal for progress tracking, compliance, and stakeholder reporting.",
    "sections": [
        "Scope definition and milestones",
        "Site supervision and QA workflow",
        "Reporting cadence and approval matrix",
    ],
}


def clone_rows(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return deepcopy(rows)


def next_id(rows: List[Dict[str, Any]]) -> int:
    return max((row.get("id", 0) for row in rows), default=0) + 1


def find_by_id(rows: List[Dict[str, Any]], item_id: int) -> Optional[Dict[str, Any]]:
    return next((row for row in rows if row.get("id") == item_id), None)


def iso_today() -> str:
    return date.today().isoformat()


def iso_now() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


def public_user_list() -> List[Dict[str, Any]]:
    return [
        {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "type": user.type, "location": user.location}
        for user in DEMO_USERS
    ]

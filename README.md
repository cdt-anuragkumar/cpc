# CPC Backend & Database

This folder adds a simple Node.js backend and a SQLite database to store the website data (sections, gallery, teachers, students, attendance, toppers, contacts, and admin credentials).

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

The server listens on `http://localhost:3000` by default.

API highlights

- `GET /api/sections/:name` — fetch section content (e.g., `about`, `home`)
- `POST /api/sections/:name` — upsert section content
- `GET /api/gallery`, `POST /api/gallery`
- `GET /api/teachers`, `POST /api/teachers`
- `GET /api/toppers`, `POST /api/toppers`
- `GET /api/students?class=6`, `POST /api/students`
- `POST /api/attendance/mark` — mark attendance for multiple students
- `GET /api/attendance?class=6&date=2026-02-20`
- `POST /api/contact` — save contact messages
- `POST /api/admin/setup` — create admin (username + password)
- `POST /api/admin/login` — verify admin credentials

Notes

- The SQLite DB file is created in `data/cpc.db` when the server runs. `data/` is ignored by `.gitignore`.
- This backend is a lightweight starting point — adapt endpoints and security (sessions, tokens) before production use.
# example
# Xtreme Fitness — Backend API

Node.js + Express + MySQL (Sequelize) REST API powering the Xtreme Fitness gym management system (Raichur, Karnataka).

## Tech Stack
Node.js · Express · MySQL · Sequelize · JWT · bcryptjs · Multer · Nodemailer · Helmet · Morgan · express-validator · express-rate-limit · pdfkit

## 1. Prerequisites
- Node.js ≥ 18
- MySQL ≥ 8.0 running locally or remotely
- An SMTP account (Gmail app password works fine) for transactional emails

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (use long random strings)
- `SMTP_USER`, `SMTP_PASSWORD` (optional in dev — email failures are logged, not thrown)

Create the database:
```sql
CREATE DATABASE xtreme_fitness CHARACTER SET utf8mb4;
```

## 3. Run

```bash
# Development (auto-creates/updates tables via sequelize.sync, hot reload)
npm run dev

# Production-style (no auto-alter; run migration first)
npm run db:migrate
npm start
```

Seed a default admin account + starter membership plans:
```bash
npm run db:seed
```
Default admin login (change immediately after first login):
```
email:    admin@xtremefitness.com   (from SEED_ADMIN_EMAIL)
password: Admin@12345               (from SEED_ADMIN_PASSWORD)
```

The API runs at `http://localhost:5000` by default. Health check: `GET /api/health`.

## 4. Project Structure

```
backend/
├── config/          # DB connection, shared constants/enums
├── controllers/      # Business logic per resource
├── middleware/       # auth, role, upload, validation, error handling, rate limiting
├── models/            # Sequelize models + associations (models/index.js)
├── routes/             # Express routers, wired to controllers
├── utils/               # ApiError, ApiResponse, JWT, email, pagination helpers
├── database/             # schema.sql (reference DDL), migrate.js, seed.js
├── uploads/                # Multer-stored images (profiles, trainers, gallery...)
├── assets/logo.jpeg          # Brand logo used in generated PDF invoices
├── app.js                      # Express app + middleware wiring
└── server.js                    # Entry point
```

## 5. Authentication

JWT-based. `POST /api/auth/login` returns `accessToken` (7d) and `refreshToken` (30d).
Send the access token as `Authorization: Bearer <token>` on protected routes.
Use `POST /api/auth/refresh-token` to mint a new access token when it expires.

Roles: `admin`, `trainer`, `member` — enforced per-route via the `authorize()` middleware.

## 6. API Overview

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/api/auth` | register, login, refresh, me, update-profile, change-password, forgot/reset-password |
| Members | `/api/members` | Admin/Trainer — full CRUD, search/sort/filter/pagination |
| Trainers | `/api/trainers` | Public list/view; Admin CRUD |
| Plans | `/api/plans` | Public list/view; Admin CRUD |
| Subscriptions | `/api/subscriptions` | Admin — assign/renew/cancel member plans |
| Attendance | `/api/attendance` | check-in / check-out (QR-ready), manual marking, history |
| Payments | `/api/payments` | Admin records payments; members view own history |
| Invoices | `/api/invoices` | Auto-generated per payment; `/:id/pdf` streams a branded PDF |
| Dashboard | `/api/dashboard/{admin,trainer,member}` | Role-specific analytics for charts |
| Notifications | `/api/notifications` | Per-user, mark read/unread |
| Gallery | `/api/gallery` | Public view; Admin upload transformation/facility photos |
| Contact | `/api/contact` | Public submit; Admin view/resolve |
| Workout Plans | `/api/workout-plans` | Admin/Trainer assign; members view own via `/my-plans` |
| Diet Plans | `/api/diet-plans` | Admin/Trainer assign; members view own via `/my-plans` |
| Progress | `/api/progress` | Members log their own BMI/body metrics; Admin/Trainer view any member's history |

All list endpoints accept `?page=&limit=` and return `{ items, pagination }`.

## 7. Security Notes
- Passwords hashed with bcrypt (cost factor 12)
- Helmet security headers, CORS restricted to `CLIENT_URL`
- express-rate-limit on all `/api` routes, stricter limiter on auth endpoints
- express-validator on all mutating routes
- xss-clean sanitizes request bodies
- JWT access tokens short-lived (7d) with a separate refresh token flow
- Trainers are scoped server-side to only their assigned members for member lists,
  attendance records, and workout/diet plans — verified in the controller layer, not
  just hidden in the UI

## 8. Not Yet Implemented (planned for a follow-up phase)
Blog CRUD routes, and a `services/` layer for scheduled jobs (membership-expiry email
cron, invoice PDF archival). The `Blog` model already exists in `models/` — only the
route/controller layer remains.

# Xtreme Fitness — Frontend (Landing Page + Auth)

React + Vite + Tailwind CSS frontend for the Xtreme Fitness gym management system.
This phase covers the **public landing page** and the **authentication flow** (login,
register, forgot/reset password), wired to the live backend API.

## Tech Stack
React 18 · Vite · Tailwind CSS · React Router DOM · Axios · React Hook Form ·
Framer Motion · Lucide React · react-hot-toast

## 1. Setup

```bash
cd frontend
npm install
cp .env.example .env
```

By default `VITE_API_URL=/api` and Vite's dev server proxies `/api` and `/uploads`
requests to `http://localhost:5000` (the backend). Make sure the backend is running
first (`cd ../backend && npm run dev`).

## 2. Run

```bash
npm run dev       # http://localhost:5173
npm run build      # production build → dist/
npm run preview     # preview the production build locally
```

## 3. What's built so far

- **Landing page** (`/`): Hero, Why Choose Us, Programs, Membership pricing (live from
  API with graceful fallback), Trainers (live), Transformation Gallery (live), BMI
  Calculator (interactive), Facilities, Nutrition teaser, Testimonials, Contact form +
  embedded Google Map for Raichur, Footer.
- **Auth pages**: Login, Register, Forgot Password, Reset Password — all wired to the
  real backend endpoints with JWT stored in `localStorage` and auto-refresh on 401s
  (see `src/services/api.js`).
- **Admin Dashboard** (`/admin/*`, protected + role-gated):
  - Dashboard Overview: live stat cards, monthly revenue (line), membership growth
    (bar), plan distribution + gender ratio (doughnut), recent payments table, top
    trainers list — all from `GET /api/dashboard/admin`.
  - Manage Members: search, gender filter, pagination, add/edit (multipart form with
    photo upload, trainer assignment), delete with confirmation.
  - Manage Trainers: same CRUD pattern — specialization, experience, shift, salary,
    certifications, photo.
  - Membership Plans: CRUD with feature list, featured/active toggles.
  - Sidebar nav also lists Attendance / Payments / Invoices / Reports / Announcements /
    Settings as "Soon" — the backend APIs for these already exist (see backend README),
    only the admin UI screens remain.
- **Member Dashboard** (`/member/*`, protected + role-gated):
  - Dashboard: welcome banner with one-tap check-in/check-out, stat cards (sessions
    this month, pending payments, membership status), current plan summary, quick
    links.
  - Profile: edit name/phone/photo, change password.
  - Attendance: full check-in/check-out history table with pagination.
  - Payments & Invoices: payment history + invoice list with authenticated PDF
    download (branded with your logo, generated server-side).
  - Workout Plan: trainer-assigned exercises grouped by day.
  - Diet Plan: trainer-assigned meals grouped by meal type, with calorie targets.
  - Progress & BMI: weight/BMI trend line chart, a form to log new measurements
    (auto-calculates BMI server-side), and full history table.
- **Role-based routing**: `ProtectedRoute` gates every `/admin`, `/trainer`, and
  `/member` route by both authentication and role, redirecting appropriately.

- **Trainer Dashboard** (`/trainer/*`, protected + role-gated):
  - Dashboard: self check-in/out, assigned member count, today's status, recently
    assigned members.
  - My Members: assigned-members table (server-scoped — a trainer only ever sees
    their own members) with quick "Assign Workout" / "Assign Diet" actions.
  - Attendance: mark attendance for any assigned member + full records table
    (also server-scoped to assigned members only).
  - Workout Plans: full CRUD with a dynamic per-day exercise builder
    (`useFieldArray`) — sets, reps, rest time.
  - Diet Plans: full CRUD with a nested meals → food-items builder, target calories,
    notes.
  - Profile: edit details/photo, change password.

## 4. Design System

Following the brand brief exactly: **Black / Dark Gray / Crimson Red / Accent Red**
palette, **Montserrat** for display type, **Inter** for body copy, **Poppins** for
UI/accent labels. Premium glassmorphism cards (`.glass` in `src/styles/index.css`)
paired with angled, kinetic CTA buttons for contrast.

**Signature element:** the "ring" from the Xtreme Fitness logo mark (the dumbbell
inside a circle) is reused structurally throughout — as a glowing backdrop behind the
hero, as progress rings around animated stat counters, and as the avatar frame on
trainer cards — tying the whole visual system back to the actual brand mark rather
than a generic decorative motif.

## 5. Project Structure

```
frontend/
├── src/
│   ├── assets/           # logo.jpeg
│   ├── components/
│   │   ├── common/       # Loader, Skeleton, ScrollReveal, RingStat
│   │   ├── landing/       # Hero, Programs, Membership, Trainers, Gallery, BMI, etc.
│   │   ├── layout/         # Navbar, Footer (public site)
│   │   └── admin/           # Sidebar, Topbar, DataTable, Pagination, Modal, ConfirmDialog,
│   │                          Badge, StatCard, Member/Trainer/PlanFormModal
│   ├── pages/
│   │   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   │   ├── admin/             # Dashboard, Members, Trainers, Plans
│   │   ├── member/             # Dashboard, Profile, Attendance, Payments, WorkoutPlan, DietPlan, Progress
│   │   ├── trainer/             # Dashboard, Members, Attendance, WorkoutPlans, DietPlans, Profile
│   │   └── Home.jsx
│   ├── layouts/                # PublicLayout, AuthLayout, AdminLayout, MemberLayout, TrainerLayout
│   ├── routes/                  # ProtectedRoute
│   ├── context/                  # AuthContext
│   ├── services/                  # api.js (axios + JWT refresh), authService, publicService, adminService, memberService, trainerService
│   ├── utils/                       # chartSetup.js (Chart.js registration + shared styles)
│   └── styles/index.css               # Tailwind + design tokens + .glass/.btn-cta system
```

## 6. Not Yet Implemented (planned for the next phase)
Admin screens for Attendance, Payments, Invoices, Reports, and Announcements
(backend APIs already exist). Programs/About/Gallery/Blog/Contact as standalone
routed pages (currently sections on the one-page landing site). Real-time
notifications (the bell icon in the topbar is currently static).

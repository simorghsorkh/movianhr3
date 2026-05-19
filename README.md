# Movian — Career Transformation Platform

A bilingual (Persian/English) HR & employability SaaS platform built with Next.js 14, TypeScript, and Tailwind CSS. Movian connects job seekers with mentors and trainers to accelerate career growth.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Fonts | Inter (EN) · Vazirmatn (FA) |
| State | React Context API |
| Persistence | localStorage (MVP — no backend) |
| Auth | Hardcoded demo accounts + localStorage |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
git clone https://github.com/simorghsorkh/movianhr.git
cd movianhr
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Demo Accounts

All accounts use password: **`demo123`**

| Role | Email | Dashboard URL |
|------|-------|---------------|
| Job Seeker | seeker@movian.io | `/dashboard/job-seeker` |
| Mentor | mentor@movian.io | `/dashboard/mentor` |
| Trainer | trainer@movian.io | `/dashboard/trainer` |
| Admin | admin@movian.io | `/dashboard/admin` |

Quick demo login buttons are available directly on the login page — no typing required.

---

## App Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── about/                      # About page
│   ├── services/                   # Services page
│   ├── pricing/                    # Pricing page
│   ├── resources/                  # Resources/blog
│   ├── login/                      # Login page
│   ├── register/                   # Register page
│   ├── onboarding/
│   │   ├── role-selection/         # Pick job-seeker/mentor/trainer
│   │   └── profile-setup/          # Initial profile info
│   └── dashboard/
│       ├── job-seeker/             # 8 sub-pages
│       ├── mentor/                 # 5 sub-pages
│       ├── trainer/                # 4 sub-pages
│       └── admin/                  # 6 sub-pages
├── components/
│   ├── ui/                         # Design system components
│   └── layout/                     # Navbar, Footer, Sidebar, Header
├── contexts/
│   ├── AuthContext.tsx             # Auth state + login/logout
│   ├── LanguageContext.tsx         # i18n + RTL/LTR switching
│   └── ToastContext.tsx            # Toast notifications
└── lib/
    ├── types.ts                    # All TypeScript interfaces
    ├── translations.ts             # EN/FA translation dictionary (~250 keys)
    ├── demoData.ts                 # Mock data for all roles
    └── utils.ts                   # cn(), formatDate(), generateId(), etc.
```

---

## Features by Role

### Job Seeker
- **Dashboard** — stats, profile completion checklist, quick actions, featured mentors/courses
- **Profile** — edit info, manage skills, add work experience & education
- **CV Builder** — choose template, fill sections, live preview
- **Career Assessment** — 5-question quiz with score ring and category breakdown
- **Roadmap** — milestone cards with priority labels, mark complete, progress bar
- **Find Mentors** — browse approved mentors, send consultation requests
- **Courses** — browse & enroll, enrolled courses section with progress
- **My Requests** — track consultation history and status

### Mentor
- **Dashboard** — earnings, pending requests, upcoming sessions
- **Requests** — accept/reject requests, add session notes, mark completed
- **Sessions** — session history with notes
- **Availability** — weekly schedule grid, click to toggle time slots
- **Profile** — edit bio, expertise tags

### Trainer
- **Dashboard** — course stats, enrollment overview
- **My Courses** — create, edit, publish, archive courses
- **Students** — enrollment table with progress bars
- **Profile** — bio and specialization

### Admin
- **Dashboard** — platform stats, pending approval alert, recent requests
- **Users** — full user table with role filter
- **Approvals** — 3-tab system (Mentors / Trainers / Courses) with approve/reject
- **Courses** — all courses overview with status filters
- **Requests** — all consultation requests with status filter
- **Reports** — 6-month bar chart, export button (placeholder)

---

## Bilingual Support

Switch between **Persian (FA/RTL)** and **English (EN/LTR)** at any time using the language toggle in the navigation bar or dashboard sidebar.

- All UI text goes through a `t(key)` translation function
- `document.documentElement.dir` is updated on switch
- Flex layouts use `flex-row-reverse` for RTL via the `isRTL` boolean from context
- Fonts: Vazirmatn (Persian) and Inter (English) swap automatically via CSS `html[dir]` selector

---

## User Flows to Test

1. **Login as Job Seeker** → Complete career assessment → View roadmap → Request a mentor → Enroll in a course
2. **Login as Mentor** → View pending requests → Accept a request → Add session notes → Mark completed → Set availability
3. **Login as Trainer** → Create a new course → Edit and publish it → View student enrollments
4. **Login as Admin** → Review approval alert → Go to Approvals → Approve a mentor → Approve a course → Check Reports

---

## Design System

### Color Tokens
- **Primary**: Indigo scale (50–950) — used for CTA buttons, active states, links
- **Accent**: Orange — used for mentor role color, highlights
- **Status colors**: Green (success/approved), Amber (pending/warning), Red (rejected/danger)

### Core Components
`Button` · `Card` · `Badge` · `Input` / `Textarea` / `Select` · `Modal` · `Avatar` · `Progress` / `ScoreRing` · `StatCard` · `EmptyState` · `Skeleton`

### Toast Notifications
All key user actions trigger contextual toasts: login success/failure, profile save, consultation requests, course enrollment, approvals, availability save, and assessment completion.

---

## Project Information

- **Repository**: https://github.com/simorghsorkh/movianhr
- **Branch**: main
- **Phase**: MVP (Phase 1) — UI prototype with localStorage persistence
- **Next phase**: Backend integration (Supabase / PostgreSQL), real auth, AI-powered assessment, payment gateway

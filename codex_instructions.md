PROJECT: VIVA Connect (Production-Level Build)

Architecture Overview (What you’re actually building)
Frontend: React + Tailwind (modular, responsive)
Backend: Node.js + Express (REST API, secure)
Database: MongoDB Atlas (cloud, scalable)
Auth: JWT-based authentication
Backup: Google Sheets API (auto logging)
Design Pattern: MVC + Service Layer

PHASES (UPGRADED SYSTEM DESIGN)
PHASE 1 — Professional Project Setup & Architecture
Prompt 1 — Frontend Setup (Scalable)
Create a React app using Vite with Tailwind CSS configured.

Structure the project as follows:
- src/
  - components/
  - pages/
  - layouts/
  - hooks/
  - services/
  - context/
  - utils/

Create a professional dashboard layout with:
- Collapsible sidebar
- Top navbar (user info + logout)
- Responsive design

Use Tailwind for a clean, modern NGO-style UI (use viva/ramakrishna mission colors).
Prompt 2 — Backend Setup (Production-ready)
Set up a Node.js + Express backend with:

- Environment variables using dotenv
- MongoDB Atlas connection via Mongoose
- Folder structure:
  - config/
  - models/
  - controllers/
  - routes/
  - middleware/
  - services/

Add:
- Global error handler middleware
- Async error wrapper
- Logging middleware (console-based)

Ensure clean architecture and scalability.

PHASE 2 — Authentication System (SECURE)
Prompt 3 — User Model + Roles
Create a User model with:
- name
- email (unique)
- password (hashed with bcrypt)
- role (admin, coordinator, volunteer)

Add timestamps.
Prompt 4 — Auth APIs
Create authentication APIs:

- POST /api/auth/register
- POST /api/auth/login

Features:
- Hash passwords
- Generate JWT token
- Return token + user data
Prompt 5 — Auth Middleware
Create middleware:
- verifyToken
- authorizeRoles (admin, coordinator)

Protect routes using JWT authentication.
Prompt 6 — Frontend Auth Integration
Create:
- Login page
- Register page

Store JWT securely

Protect routes:
- Redirect if not authenticated

PHASE 3 — Volunteer Management (ADVANCED)
Prompt 7 — Volunteer Model (Enhanced)
Create Volunteer model:

- name
- email
- phone
- skills (array)
- availability
- assignedEvents (array of ObjectIds)
- totalSevaHours (number, default 0)
Prompt 8 — Volunteer APIs
Create APIs:

- POST /api/volunteers
- GET /api/volunteers
- GET /api/volunteers/:id
- PUT /api/volunteers/:id
- DELETE /api/volunteers/:id

Add validation and error handling.
Prompt 9 — Volunteer UI
Create a Volunteers page:

Features:
- Table view (search + filter)
- Add/Edit volunteer modal
- Clean Tailwind UI

Add pagination support.

PHASE 4 — Event Management (CORE SYSTEM)
Prompt 10 — Event Model (Robust)
Create Event model:

- title
- description
- date
- location
- volunteers (array of ObjectIds)
- peopleServed (number)
- createdBy (user reference)
Prompt 11 — Event APIs
Create APIs:

- POST /api/events
- GET /api/events
- GET /api/events/:id
- PUT /api/events/:id
- DELETE /api/events/:id

Add ability to assign volunteers to events.
Prompt 12 — Event UI (Advanced)
Create Events page:

Features:
- Create/Edit event
- Assign volunteers (multi-select dropdown)
- Display event cards or table
- Show number of people served

Clean, structured UI using Tailwind.

PHASE 5 — Impact Analytics Dashboard (KEY DIFFERENTIATOR)
Prompt 13 — Stats Service
Create a stats service that calculates:

- totalVolunteers
- totalEvents
- totalPeopleServed
- totalSevaHours

Use MongoDB aggregation pipelines.
Prompt 14 — Dashboard API
Create:
GET /api/dashboard/stats

Return aggregated data.
Prompt 15 — Dashboard UI (Modern)
Create Dashboard page:

- KPI cards
- modern smart charts 
- Clean Tailwind layout

Display:
- Volunteers
- Events
- People Served
- Seva Hours

PHASE 6 — Google Sheets Backup (SMART + UNIQUE)
Prompt 16 — Google Sheets Integration
Integrate Google Sheets API.

When:
- New volunteer added
- New event created

Log data into Google Sheet.

Create a service for Sheets logging.

PHASE 7 — Security & Performance (CRITICAL)
Prompt 17 — Security Hardening
Add:
- Helmet.js
- Rate limiting
- Input sanitization
- CORS config

Prevent common vulnerabilities.
Prompt 18 — Validation Layer
Use a validation library (Joi or Zod).

Validate:
- Request body
- Query params

Return structured errors.

PHASE 8 — UI/UX Polish (LEGACY FEEL)
Prompt 19 — UX Refinement
Improve:
- Spacing
- Typography
- Color consistency

Add:
- Loading states
- Empty states
- Toast notifications

Keep design calm, minimal, and professional.
Prompt 20 — Responsive Optimization
Ensure full mobile responsiveness.

- Sidebar collapses
- Tables become scrollable
- Forms adapt to mobile
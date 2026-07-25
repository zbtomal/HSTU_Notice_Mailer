# Project Overview & Architecture Guide

This document serves as a comprehensive guide to help AI coding agents understand the structure, components, and workflows of the **HSTU Notice Mailer** project.

---

## 1. Directory Structure

```text
HSTU_Notice_Mailer/
├── .github/workflows/
│   └── scrape.yml            # GitHub Actions cron runner (runs scraper every 15 mins)
├── alembic/                  # Database schema migrations
├── app/                      # Main FastAPI Backend Application
│   ├── core/
│   │   ├── config.py         # Application configuration & env settings
│   │   └── security.py       # Password hashing and JWT helpers
│   ├── models/
│   │   ├── category.py       # Category DB model
│   │   ├── notice.py         # Notice DB model
│   │   └── user.py           # User & Subscriptions DB models
│   ├── routers/
│   │   ├── auth.py           # User registration, OTP verification, login, password resets
│   │   ├── notice.py         # Retrieving notices with filters/pagination
│   │   ├── scraper.py        # Secured webhook receiver for parsed notices
│   │   └── users.py          # Subscribers API (subscribe/unsubscribe & category listing)
│   ├── schemas/
│   │   ├── __init__.py       # Facade exporting all schemas
│   │   ├── auth.py           # Authentication schemas (Token, UserVerify, Login, Requests)
│   │   ├── category.py       # Category schemas
│   │   ├── notice.py         # Notice schemas
│   │   └── user.py           # User schemas
│   ├── services/
│   │   ├── auth_service.py   # JWT generation and login validation
│   │   ├── email_services.py # SMTP helpers for OTP & Notice mail alerts
│   │   └── notice_service.py # Notice processing & subscriber filtering
│   ├── database.py           # Async engine and session database configuration
│   ├── dependencies.py       # Auth dependencies (e.g., get_current_active_user)
│   └── main.py               # FastAPI entrypoint, serving index.html & API router
├── frontend/                 # React Frontend Application (to be built)
│   └── index.html            # Temporary static index file
├── scraper.py                # Standalone scraping client (runs locally or via GitHub Actions)
├── last_notice_id.txt        # Stores the ID of the last notice processed to prevent repeat requests
├── vercel.json               # Serverless routing setup for Vercel deployment
├── requirements.txt          # Python dependencies
└── runtime.txt               # Specifies Python version (3.12.2) for Render
```

---

## 2. Database Design & Relationships

The project uses PostgreSQL (via **SQLAlchemy asyncpg**). 

### Entities:
1. **User (`users` table)**:
   - Contains credentials (`email`, nullable `hashed_password` to support future OAuth2), account activation state (`is_active` boolean), and password reset columns (`reset_password_otp`, `reset_otp_expires_at`).
   - Profile metadata columns (`full_name`, `profile_picture_url`).
   - OAuth2 integration columns (`oauth_provider` like google/facebook, `oauth_id` provider user ID).
2. **Category (`categories` table)**:
   - Holds names of sections extracted from the page HTML (e.g., *"Science"*, *"Engineering"*, *"Computer Science and Engineering (CSE)"*, *"Office & Section"*).
3. **Notice (`notices` table)**:
   - Stores notice details (title, notice link, download attachment link, description, date parsed, and a foreign key `category_id`).
4. **User Subscriptions (`user_subscriptions` join table)**:
   - A many-to-many relationship mapping `User` to `Category` subscriptions.

---

## 3. Core Workflows

### A. Authentication & Verification
1. **Registration**: `POST /auth/register` creates an inactive user account and sends a 6-digit OTP code to their email.
2. **Verification**: `POST /auth/verify` validates the code to set `is_active = True`.
3. **Login**: `POST /auth/login` validates credentials and returns a JWT access token.
4. **Forgot Password**: `POST /auth/forgot-password` generates a 10-minute expiry OTP and mails it.
5. **Reset Password**: `POST /auth/reset-password` accepts the OTP and hashes the new password.
6. **Change Password**: `POST /auth/change-password` allows a logged-in user to change their password by verifying their old password.

### B. Notice Scraper & Mail Dispatch
1. **Cron Trigger**: GitHub Actions runs `scraper.py` every 15 minutes.
2. **Parsing**: It parses the HSTU portal (`https://hstu.ac.bd/page/notice_all`), extracting title, link, download link, date, and category (from the `<i class="fa fa-building"></i>` parent span text).
3. **Delta Check**: The scraper reads `last_notice_id.txt`. If the latest notice on the website matches the saved ID, it terminates instantly without hitting the API.
4. **Webhook Submission**: If new notices are found, it POSTs the delta to `POST /api/v1/scraper/webhook` using `SCRAPER_API_KEY` authentication (with a generous 180s timeout to survive cold starts).
5. **Database Sync**: The backend inserts notices and creates new categories dynamically.
6. **Mailing List Evaluation**:
   - For each new notice, the backend fetches users subscribed to the notice's specific category **OR** subscribed to the `"General"` category (which acts as a master subscription).
   - If the database is completely empty (first run), email notifications are bypassed as a spam shield.
7. **FastAPI Background Tasks**: Email alerts are sent asynchronously in the background. The API response returns immediately, ensuring the scraper finishes in a few seconds while emails dispatch gracefully in the background.

---

## 4. Frontend Objectives

We want to build a modern, high-quality **React** frontend inside the `frontend/` directory.

### Key Screens:
1. **Notice Feed**: Public view showing latest notices, searchable and filterable by category.
2. **Auth Pages**: Login, Register (with OTP verification), Forgot/Reset password.
3. **Subscriber Dashboard (Authenticated)**:
   - Manage category subscriptions (users can subscribe/unsubscribe to specific categories like CSE, Science, Engineering, etc.).
   - Account settings (Change Password, logout).

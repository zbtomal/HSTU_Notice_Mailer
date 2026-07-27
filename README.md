# 🔔 HSTU Notice Mailer & Real-time Alert System

> An automated, real-time notice scraping, category-based notification engine, and modern web application for Hajee Mohammad Danesh Science and Technology University (HSTU) students, faculty, and staff.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Async-336791.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg?style=flat&logo=vercel)](https://hstunotice.vercel.app)

---

## 📌 Problem & Use Case

### The Problem
Hajee Mohammad Danesh Science and Technology University ([hstu.ac.bd](https://hstu.ac.bd)) publishes important official notices across dozens of faculties, departments, administrative offices, exam sections, and halls daily. However:
1. **Missed Deadlines**: Students and faculty members often miss critical announcements (exam routines, admission schedules, scholarship deadlines, fee payment routines) because they have to manually visit the university website multiple times a day.
2. **No Real-time Alerts**: The official website does not offer email or push notification alerts when new notices are released.
3. **Unfiltered Notice Stream**: Notices from all faculties and administrative offices are mixed together in a single raw list, making it time-consuming for students to find announcements relevant to their specific department.

### The Solution: HSTU Notice Mailer
**HSTU Notice Mailer** solves this by acting as an automated intelligence bridge between the university website and its community:
- 🕷️ **Automated Scraper Engine**: Continuously monitors the official HSTU notice board (`https://hstu.ac.bd/page/notice_all`) in the background.
- 🏷️ **Smart Categorization**: Normalizes raw HSTU announcements into **17 clean canonical categories** (e.g., *Computer Science & Engineering (CSE)*, *Business Studies*, *Fisheries*, *Office & Section*, etc.).
- ✉️ **Custom Email Alert Subscriptions**: Users can register, verify their email with a 6-digit OTP, and subscribe specifically to the department or faculty categories they care about.
- ⚡ **Instant Email Notifications**: As soon as a new notice is published, an asynchronous background task sends a formatted email alert directly to subscribed users.
- ⏸️ **Notification Pause/Resume**: Users can pause email notifications during vacations or exam breaks without losing their category preferences.
- 🌐 **Modern React Web Portal**: Includes keyword search, category filtering, dark/light high-contrast theme toggling, master "Subscribe to All" controls, and responsive mobile UI.

---

## ✨ Key Features

### 🎓 For Students & Subscribers
- **6-Digit OTP Email Verification**: Secure registration & password reset workflow using email verification codes.
- **Granular Category Subscriptions**: Subscribe to specific faculties/departments (CSE, ECN, DEV, FET, EEE, Agriculture, etc.) or administration feeds.
- **Master "Subscribe to All" & "Unsubscribe All"**: 1-click subscription toggle across all 17 university categories.
- **Email Notification Pause & Resume**: Temporarily pause email alerts anytime from the dashboard.
- **Keyword & Category Filtered Search**: Search through thousands of archived HSTU notices instantly.
- **High-Contrast Dark / Light Mode**: Beautiful glassmorphism UI built with TailwindCSS and Lucide Icons.

### ⚙️ For Developers & System Architecture
- **FastAPI Async Core**: Built on Python 3.11 with `async/await` and SQLAlchemy 2.0 Asyncpg ORM.
- **Robust Background APScheduler**: Runs background scraping tasks periodically with defensive HTML parsing against layout changes.
- **Secure Authentication**: JWT (JSON Web Tokens) with passlib bcrypt hashing.
- **RESTful API**: Standardized endpoints for Auth, Users, Notices, and Categories.
- **Vercel Web Analytics**: Native page view & performance tracking integration.

---

## 🏗️ System Architecture

```text
[ HSTU Official Notice Board (hstu.ac.bd) ]
                     │
                     ▼ (HTML Scraping via BeautifulSoup4)
     [ FastAPI Scraper Engine (scraper.py) ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼ (New Notice Detected)
[ PostgreSQL Database ]  [ Async Email Dispatcher (email_service.py) ]
                                 │
                                 ▼ (SMTP Email Alerts)
                     [ Subscribed Users' Inboxes ]
```

---

## 📁 Project Structure

```text
HSTU_Notice_Mailer/
├── app/                        # FastAPI Backend Application
│   ├── main.py                 # App entry point & FastAPI instance
│   ├── database.py             # SQLAlchemy Async Engine & Session local
│   ├── models/                 # SQLAlchemy DB Models (User, Notice, Category)
│   ├── schemas/                # Pydantic Request/Response Schemas
│   ├── services/               # Business Logic (User, Notice, Email Services)
│   ├── routers/                # API Endpoints (/auth, /users, /notices)
│   ├── scraper.py              # HSTU Async BeautifulSoup4 Scraper
│   ├── scheduler.py            # APScheduler Background Task Manager
│   ├── email_service.py        # Async FastMail / aiosmtplib Email Sender
│   └── config.py               # Pydantic BaseSettings & Environment Variables
├── frontend/                   # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── api/client.js       # Centralized API Service Repository
│   │   ├── context/            # AuthContext & Theme Provider
│   │   ├── components/         # Clean Micro-Components (auth, dashboard, feed)
│   │   ├── App.jsx             # React Router Config & Main Layout
│   │   └── main.jsx            # Entry point & Vercel Analytics
│   ├── package.json
│   └── vite.config.js
├── vercel.json                 # Vercel Deployment & SPA Route Rewrites
├── requirements.txt            # Python Dependencies
├── .env.example                # Environment Variable Template
└── README.md                   # Project Documentation
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the project root directory using `.env.example` as a template:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/hstu_notice_mailer

# Security Settings
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
SCRAPER_API_KEY=your_secure_scraper_api_key

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_EMAIL=your_gmail@gmail.com
SMTP_FROM_NAME="HSTU Notice Mailer"
```

---

## 🚀 Running Locally

### 1. Backend Setup (FastAPI)

```bash
# Clone repository
git clone https://github.com/zbtomal/HSTU_Notice_Mailer.git
cd HSTU_Notice_Mailer

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start PostgreSQL and update DATABASE_URL in .env

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```

FastAPI Swagger API Documentation will be available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install npm packages
npm install

# Run Vite dev server
npm run dev
```

Frontend web portal will be accessible at: `http://localhost:5173/`

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Register new user & send 6-digit OTP | ❌ |
| `POST` | `/api/v1/auth/verify-email` | Verify email address using OTP code | ❌ |
| `POST` | `/api/v1/auth/login` | Login user & receive JWT Access Token | ❌ |
| `GET` | `/api/v1/users/me` | Fetch current user profile & active subscriptions | 🔒 |
| `POST` | `/api/v1/users/subscribe` | Subscribe to a specific notice category | 🔒 |
| `POST` | `/api/v1/users/unsubscribe` | Unsubscribe from a category | 🔒 |
| `POST` | `/api/v1/users/subscribe-all` | Batch subscribe to all 17 categories | 🔒 |
| `POST` | `/api/v1/users/unsubscribe-all` | Batch unsubscribe from all categories | 🔒 |
| `GET` | `/api/v1/notices/` | List notices (supports `category_id`, `search`, `page`) | ❌ |

---

## 🌩️ Deployment

### Vercel Deployment
The project is configured for seamless deployment on Vercel (`vercel.json` included).
1. Connect your GitHub repository to Vercel.
2. Set Environment Variables (`DATABASE_URL`, `SECRET_KEY`, `SMTP_*`, etc.).
3. Deploy! Live demo: [hstunotice.vercel.app](https://hstunotice.vercel.app)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Developed with ❤️ for the HSTU Community.</p>

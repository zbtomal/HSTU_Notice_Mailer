# 🔔 HSTU Notice Mailer & Real-time Alert System

<div align="center">

### 🚀 Intelligent Notice Scraping • 📧 Real-time Email Alerts • ⚡ FastAPI Backend • ⚛️ React Frontend

> **An automated, cloud-based notice monitoring and real-time notification platform for Hajee Mohammad Danesh Science and Technology University (HSTU).**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Async-336791.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg?style=for-the-badge&logo=vercel)](https://hstunotice.vercel.app)

---

### 📚 Academic Group Project

**Cloud Computing Sessional**  
**Department of Computer Science & Engineering (CSE)**  
**Hajee Mohammad Danesh Science & Technology University (HSTU)**

</div>

---

# 📑 Table of Contents

- [📖 Project Overview](#-project-overview)
- [🎓 Academic Information](#-academic-information)
- [👥 Team Members](#-team-members)
- [📌 Problem & Use Case](#-problem--use-case)
- [✨ Key Features](#-key-features)
- [🛠 Technology Stack](#-technology-stack)
- [🏗 System Architecture](#-system-architecture)
- [📂 Project Structure](#-project-structure)
- [⚙️ Environment Variables Setup](#️-environment-variables-setup)
- [🚀 Running Locally](#-running-locally)
- [📡 REST API Endpoints](#-key-rest-api-endpoints)
- [🌩 Deployment](#-deployment)
- [🚀 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

# 📖 Project Overview

Managing university notices efficiently is a common challenge for students, faculty members, and administrative staff. Important announcements such as examination schedules, admission notices, scholarship opportunities, fee payment deadlines, and departmental circulars are published regularly on the official HSTU website. Since users must manually visit the notice board multiple times each day, important updates are often missed.

**HSTU Notice Mailer & Real-time Alert System** was developed to solve this problem by providing an automated, cloud-based solution that continuously monitors the official HSTU notice board, intelligently categorizes notices, stores them in a PostgreSQL database, and instantly sends email notifications to subscribed users.

Built with **FastAPI**, **React**, **PostgreSQL**, **Tailwind CSS**, and asynchronous background services, the platform provides a modern, responsive, and scalable experience while eliminating the need for users to manually check the university website.

---

# 🎓 Academic Information

| Item | Details |
|------|----------|
| **Project Title** | HSTU Notice Mailer & Real-time Alert System |
| **Course** | Cloud Computing Sessional |
| **Project Type** | Academic Group Project |
| **Department** | Department of Computer Science & Engineering (CSE) |
| **University** | Hajee Mohammad Danesh Science & Technology University (HSTU) |
| **Academic Purpose** | Cloud-based Real-time Notice Monitoring & Notification System |

---

# 👥 Team Members

| Name | Contribution |
|------|--------------|
| **Zikrul Bari Tomal** | Backend Development, Scraper Engine, API Development |
| **Jannatul Ferthaous** | Frontend Development, UI/UX Design |
| **Ashikur Rahman** | Backend Development, Database Design, Documentation, Testing & Deployment |

> This project was collaboratively developed as part of the **Cloud Computing Sessional** course for the **Department of Computer Science & Engineering, HSTU**.

---

# 📌 Problem & Use Case

## ❗ The Problem

Hajee Mohammad Danesh Science and Technology University ([hstu.ac.bd](https://hstu.ac.bd)) publishes important official notices across dozens of faculties, departments, administrative offices, examination sections, institutes, and residential halls every day.

Unfortunately, the current system presents several challenges for students, faculty members, and staff.

### Major Challenges

### 📅 1. Missed Deadlines

Students frequently miss important announcements such as:

- Examination routines
- Admission schedules
- Registration deadlines
- Scholarship circulars
- Fee payment notices
- Departmental announcements

because they must manually check the university website multiple times each day.

---

### 🔔 2. No Real-time Notification System

The official HSTU website currently does **not** provide:

- Email notifications
- Push notifications
- Instant alerts

As a result, users remain unaware of newly published notices until they manually visit the website.

---

### 📑 3. Unorganized Notice Feed

All university notices are displayed together in one large notice list.

This creates several problems:

- Students cannot easily locate notices related to their department.
- Faculty-specific announcements are mixed with administrative notices.
- Finding relevant information becomes time-consuming.
- Users often overlook important notices hidden among unrelated announcements.

---

# 💡 The Solution — HSTU Notice Mailer

**HSTU Notice Mailer & Real-time Alert System** bridges the communication gap between the official university website and the HSTU community by automatically monitoring the notice board and delivering relevant announcements directly to users.

Instead of requiring students to repeatedly visit the university website, the system performs the entire process automatically.

### The platform provides:

- 🕷 **Automated Scraper Engine** that continuously monitors the official HSTU notice board (`https://hstu.ac.bd/page/notice_all`).

- 🏷 **Smart Notice Categorization** that converts raw HSTU notices into **17 clean canonical categories** including:

  - Computer Science & Engineering (CSE)
  - Electronics & Communication Engineering (ECE)
  - Electrical & Electronic Engineering (EEE)
  - Fisheries
  - Agriculture
  - Veterinary
  - Business Studies
  - Administrative Offices
  - Examination Sections
  - Residential Halls
  - and many more.

- 📧 **OTP-based Secure Registration** with email verification.

- 📬 **Department-specific Email Subscriptions** allowing users to receive only the notices that matter to them.

- ⚡ **Instant Email Notifications** whenever a newly published notice matches the user's subscribed categories.

- ⏸ **Pause / Resume Notification Feature** so users can temporarily disable notifications without losing their subscription preferences.

- 🔍 **Powerful Search & Category Filtering** for browsing archived university notices.

- 🌙 **Modern Responsive React Dashboard** featuring Dark Mode, Light Mode, glassmorphism UI, and mobile-friendly design.

---

# ✨ Key Features
## 🎓 For Students & Subscribers

Designed to make staying informed effortless, the platform delivers personalized, real-time university notices directly to users.

### 📧 Secure Authentication & Account Management

- ✅ **6-Digit OTP Email Verification** for secure account registration.
- ✅ **OTP-based Password Reset** for quick and secure account recovery.
- ✅ **JWT Authentication** with protected API endpoints.
- ✅ **Secure Password Hashing** using **bcrypt**.

---

### 📨 Personalized Notice Subscription

Instead of receiving every university notice, users can subscribe only to categories that matter to them.

Features include:

- Department-wise subscriptions
- Faculty-wise subscriptions
- Administrative office subscriptions
- Examination section subscriptions
- Hall notices

Supported categories include:

- Computer Science & Engineering (CSE)
- Electronics & Communication Engineering (ECE)
- Electrical & Electronic Engineering (EEE)
- Agriculture
- Fisheries
- Veterinary
- Business Studies
- Office & Section
- Residential Halls
- and more...

---

### ⚡ One-Click Subscription Management

The dashboard provides convenient subscription controls.

- ✅ Subscribe to individual categories
- ✅ Unsubscribe from individual categories
- ✅ **Subscribe to All** (all 17 categories)
- ✅ **Unsubscribe from All**
- ✅ Pause Notifications
- ✅ Resume Notifications

---

### 🔍 Advanced Notice Search

Users can quickly find relevant notices through:

- Keyword search
- Department filtering
- Category filtering
- Paginated notice browsing

Thousands of archived notices can be searched instantly.

---

### 🌙 Modern User Experience

The React frontend provides a clean and responsive interface featuring:

- Dark Mode
- Light Mode
- High Contrast Theme
- Glassmorphism Design
- Responsive Mobile Layout
- Lucide Icons
- Smooth Navigation

---

## ⚙️ For Developers & System Architecture

The application follows a modern asynchronous architecture built for scalability, maintainability, and cloud deployment.

### 🚀 FastAPI Async Backend

Built using **Python 3.11** and modern asynchronous programming.

Features include:

- FastAPI
- Async/Await Architecture
- SQLAlchemy 2.0 Async ORM
- AsyncPG PostgreSQL Driver
- Dependency Injection
- Automatic OpenAPI Documentation

---

### 🕷 Intelligent Background Scraper

A scheduled scraper continuously monitors the official HSTU notice board.

Capabilities include:

- Periodic Background Execution
- BeautifulSoup4 HTML Parsing
- Duplicate Notice Detection
- Defensive HTML Parsing
- Automatic Database Synchronization

---

### 📧 Asynchronous Email Notification Engine

When a new notice is detected:

1. Notice is parsed.
2. Category is identified.
3. Matching subscribers are found.
4. Email is generated.
5. Email is delivered asynchronously.

This ensures the web application remains responsive while notifications are processed in the background.

---

### 🔐 Security Features

The platform implements multiple security measures.

- JWT Authentication
- bcrypt Password Hashing
- Environment Variable Configuration
- Protected REST APIs
- Email Verification
- API Key Protection
- Secure SMTP Authentication

---

### 📊 RESTful API Design

The backend exposes a clean REST API consisting of:

- Authentication APIs
- User APIs
- Notice APIs
- Category APIs
- Subscription APIs

Interactive API documentation is automatically generated using FastAPI Swagger.

---

### 📈 Analytics

Integrated with **Vercel Web Analytics** for:

- Visitor Statistics
- Performance Monitoring
- Page Views
- Traffic Insights

---

# 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| **Programming Language** | Python 3.11, JavaScript (ES6+) |
| **Backend Framework** | FastAPI |
| **Frontend Framework** | React 19 + Vite |
| **Database** | PostgreSQL |
| **ORM** | SQLAlchemy 2.0 Async |
| **Database Driver** | AsyncPG |
| **Authentication** | JWT |
| **Password Security** | Passlib + bcrypt |
| **Email Service** | FastMail / aiosmtplib |
| **Web Scraping** | BeautifulSoup4 |
| **Task Scheduling** | APScheduler |
| **Validation** | Pydantic |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Deployment** | Vercel |
| **Version Control** | Git & GitHub |

---

# 🏗 System Architecture

```text
                         ┌──────────────────────────────────────┐
                         │      HSTU Official Notice Board      │
                         │          https://hstu.ac.bd          │
                         └──────────────────────────────────────┘
                                         │
                                         │
                              BeautifulSoup4 Scraper
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │        FastAPI Scraper Engine                │
                  │          (scraper.py)                        │
                  └──────────────────────────────────────────────┘
                                         │
                      Detect New Notices & Categorize
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
      ┌───────────────────────────┐          ┌─────────────────────────────┐
      │ PostgreSQL Database       │          │ APScheduler Background Jobs │
      │ Users • Notices • Categories│        │ Periodic Scraping Tasks     │
      └───────────────────────────┘          └─────────────────────────────┘
                     │
                     ▼
        Match Notice with User Subscriptions
                     │
                     ▼
      ┌──────────────────────────────────────┐
      │ Async Email Notification Service     │
      │ FastMail / aiosmtplib (SMTP)         │
      └──────────────────────────────────────┘
                     │
                     ▼
          📧 Subscribed Users Receive Alerts
```

---

# 🔄 System Workflow

```text
Official HSTU Notice Board
            │
            ▼
Periodic Background Scraper
            │
            ▼
HTML Parsing using BeautifulSoup4
            │
            ▼
Notice Categorization
            │
            ▼
Duplicate Detection
            │
            ▼
Save to PostgreSQL Database
            │
            ▼
Find Matching Subscribers
            │
            ▼
Generate Email Notification
            │
            ▼
Send Email via SMTP
            │
            ▼
Users Receive Instant Alerts
```

---

# 📊 System Highlights

| Feature | Description |
|----------|-------------|
| 🕷 Automated Scraping | Continuously monitors the official HSTU notice board |
| 📂 Smart Categorization | Organizes notices into 17 university categories |
| 📧 Email Notifications | Instantly delivers new notices to subscribed users |
| 🔐 Secure Authentication | JWT + OTP verification + bcrypt hashing |
| ⚡ Async Processing | Non-blocking FastAPI backend |
| 🗄 PostgreSQL Database | Persistent storage for users, notices, and subscriptions |
| 🔍 Advanced Search | Fast keyword and category filtering |
| 🌙 Responsive UI | Mobile-friendly dashboard with Dark & Light themes |
| ☁ Cloud Ready | Easily deployable on Vercel |

---

# 📁 Project Structure
```text
HSTU_Notice_Mailer/
│
├── app/                                # FastAPI Backend Application
│   │
│   ├── main.py                         # FastAPI application entry point
│   ├── database.py                     # SQLAlchemy Async Engine & Session
│   ├── config.py                       # Environment Variables & Settings
│   ├── scraper.py                      # BeautifulSoup4 Notice Scraper
│   ├── scheduler.py                    # APScheduler Background Jobs
│   ├── email_service.py                # Async Email Sender
│   │
│   ├── models/                         # Database Models
│   │   ├── user.py
│   │   ├── notice.py
│   │   ├── category.py
│   │   └── ...
│   │
│   ├── schemas/                        # Pydantic Request/Response Schemas
│   │   ├── auth.py
│   │   ├── notice.py
│   │   ├── user.py
│   │   └── ...
│   │
│   ├── routers/                        # REST API Routes
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── notices.py
│   │   └── categories.py
│   │
│   ├── services/                       # Business Logic Layer
│   │   ├── auth_service.py
│   │   ├── notice_service.py
│   │   ├── user_service.py
│   │   ├── email_service.py
│   │   └── ...
│   │
│   └── utils/                          # Helper Functions
│
├── frontend/                           # React Frontend (Vite)
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js               # Axios API Client
│   │   │
│   │   ├── components/                 # Reusable UI Components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── notices/
│   │   │   └── common/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .env.example                        # Environment Variable Template
├── requirements.txt                    # Python Dependencies
├── vercel.json                         # Deployment Configuration
├── README.md
└── LICENSE
```

---

# ⚙️ Environment Variables Setup

Create a `.env` file in the project root directory using `.env.example` as a template.

```env
# ==============================
# PostgreSQL Database
# ==============================

DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/hstu_notice_mailer


# ==============================
# Security
# ==============================

SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

SCRAPER_API_KEY=your_secure_scraper_api_key


# ==============================
# SMTP Email Configuration
# ==============================

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME="HSTU Notice Mailer"
```

> **Note:** Never commit your `.env` file to GitHub. Store sensitive credentials securely and keep only `.env.example` in the repository.

---

# 🚀 Running the Project Locally

## 📋 Prerequisites

Before running the project, ensure the following software is installed:

| Software | Version |
|-----------|---------|
| Python | 3.11 or later |
| Node.js | 18+ |
| PostgreSQL | 14+ |
| Git | Latest |
| npm | Latest |

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/zbtomal/HSTU_Notice_Mailer.git

cd HSTU_Notice_Mailer
```

---

# 2️⃣ Backend Setup (FastAPI)

### Create a Virtual Environment

```bash
python -m venv .venv
```

### Activate the Virtual Environment

**Windows**

```bash
.venv\Scripts\activate
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Configure Environment Variables

Create a `.env` file using `.env.example`.

Update:

- DATABASE_URL
- SECRET_KEY
- SMTP Configuration
- SCRAPER_API_KEY

---

### Start PostgreSQL

Ensure PostgreSQL is running before starting the backend server.

---

### Run the FastAPI Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:

```
http://localhost:8000
```

Swagger Documentation:

```
http://localhost:8000/docs
```

ReDoc Documentation:

```
http://localhost:8000/redoc
```

---

# 3️⃣ Frontend Setup (React + Vite)

Navigate to the frontend directory:

```bash
cd frontend
```

---

### Install Dependencies

```bash
npm install
```

---

### Start the Development Server

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

# 📸 Application Preview

> Replace these placeholders with screenshots after deployment.

## 🏠 Home Page

```text
docs/screenshots/home.png
```

---

## 📄 Notice Feed

```text
docs/screenshots/notices.png
```

---

## 📬 User Dashboard

```text
docs/screenshots/dashboard.png
```

---

## 📧 Email Notification

```text
docs/screenshots/email.png
```

---

# 📡 Key REST API Endpoints

| Method | Endpoint | Description | Authentication |
|:------:|----------|-------------|:--------------:|
| POST | `/api/v1/auth/register` | Register a new user | ❌ |
| POST | `/api/v1/auth/verify-email` | Verify email using OTP | ❌ |
| POST | `/api/v1/auth/login` | User Login | ❌ |
| POST | `/api/v1/auth/forgot-password` | Request Password Reset OTP | ❌ |
| POST | `/api/v1/auth/reset-password` | Reset Password | ❌ |
| GET | `/api/v1/users/me` | Get Current User Profile | 🔒 |
| POST | `/api/v1/users/subscribe` | Subscribe to Category | 🔒 |
| POST | `/api/v1/users/unsubscribe` | Unsubscribe from Category | 🔒 |
| POST | `/api/v1/users/subscribe-all` | Subscribe to All Categories | 🔒 |
| POST | `/api/v1/users/unsubscribe-all` | Unsubscribe from All Categories | 🔒 |
| POST | `/api/v1/users/pause-notifications` | Pause Email Notifications | 🔒 |
| POST | `/api/v1/users/resume-notifications` | Resume Email Notifications | 🔒 |
| GET | `/api/v1/notices` | Retrieve Notices | ❌ |
| GET | `/api/v1/categories` | List Categories | ❌ |

---

# 🌩️ Deployment
## ☁️ Vercel Deployment

This project is configured for seamless deployment using **Vercel**.

### Deployment Steps

1. Fork or clone the repository.
2. Connect the GitHub repository to Vercel.
3. Configure the required environment variables.
4. Deploy the application.

Required environment variables include:

- `DATABASE_URL`
- `SECRET_KEY`
- `SCRAPER_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

The project already includes a **`vercel.json`** configuration file for routing and deployment.

> **Live Demo:** https://hstunotice.vercel.app

---

# 🔒 Security Features

The application follows modern security practices to ensure user data and authentication remain protected.

### Authentication

- ✅ JWT Access Token Authentication
- ✅ Secure Password Hashing using bcrypt
- ✅ Protected REST API Endpoints
- ✅ OTP Email Verification
- ✅ Password Reset via Email OTP

### Data Protection

- Environment Variable Configuration
- Secure SMTP Authentication
- SQLAlchemy ORM Protection
- Input Validation with Pydantic
- Async Database Transactions

---

# 📈 Performance Highlights

- ⚡ Fully Asynchronous FastAPI Backend
- ⚡ SQLAlchemy Async ORM
- ⚡ Async PostgreSQL Driver (asyncpg)
- ⚡ Background Task Scheduling with APScheduler
- ⚡ Responsive React Frontend
- ⚡ Lightweight REST API
- ⚡ Optimized Notice Search
- ⚡ Mobile-Friendly Interface

---

# 🚀 Future Improvements

Although the current system is fully functional, several enhancements can further improve its capabilities.

## Planned Features

- 📱 Native Android Application
- 🍎 Native iOS Application
- 🔔 Push Notification Support
- 📅 Google Calendar Integration
- 🤖 AI-powered Notice Summarization
- 🌐 Multi-language Support
- 📊 Administrative Analytics Dashboard
- 📎 Attachment Preview
- 🔍 OCR Support for Image Notices
- ☁ Docker Containerization
- ☸ Kubernetes Deployment
- 📡 WebSocket-based Live Notice Feed

---

# 🧪 Testing

The application has been tested for the following scenarios:

- ✔ User Registration
- ✔ Email Verification
- ✔ User Login
- ✔ Password Reset
- ✔ Category Subscription
- ✔ Subscribe All / Unsubscribe All
- ✔ Pause & Resume Notifications
- ✔ Notice Scraping
- ✔ Email Delivery
- ✔ Search Functionality
- ✔ Responsive User Interface

---

# 🤝 Contributing

Contributions are welcome!

If you'd like to improve this project:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

Please ensure your code follows the existing project structure and coding style.

---

# 💡 Project Highlights

This project demonstrates the practical implementation of several cloud computing and modern web development concepts.

### Cloud Computing Concepts

- Cloud-based Web Application
- Asynchronous Backend Processing
- Background Job Scheduling
- RESTful API Architecture
- Cloud Deployment
- Environment-based Configuration

### Software Engineering Concepts

- MVC-inspired Project Structure
- Modular Backend Design
- Component-based React Architecture
- Secure Authentication
- Database Normalization
- Clean Code Organization

---

# 🙏 Acknowledgements

We sincerely express our gratitude to the **Department of Computer Science & Engineering**, **Hajee Mohammad Danesh Science and Technology University (HSTU)**, for providing the opportunity to develop this project as part of the **Cloud Computing Sessional** course.

We also thank everyone who contributed through testing, feedback, and valuable suggestions during the development process.

---

# 📄 License

This project is distributed under the **MIT License**.

See the **LICENSE** file for more information.

---

# ⭐ Support the Project

If you found this project helpful, please consider giving it a ⭐ on GitHub.

Your support helps encourage future improvements and open-source contributions.

---

<div align="center">

# ❤️ Developed with Passion for the HSTU Community

### HSTU Notice Mailer & Real-time Alert System

**Cloud Computing Sessional Project**

Department of Computer Science & Engineering (CSE)  
Hajee Mohammad Danesh Science and Technology University (HSTU)

---

### 👥 Developed By

**Zikrul Bari Tomal**

**Jannatul Ferthaous**

**Ashikur Rahman**

---

**Thank you for visiting this repository!**

⭐ **Don't forget to star this project if you found it useful.**

</div>

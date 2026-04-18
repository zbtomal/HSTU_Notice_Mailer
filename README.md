# HSTU Notice Mailer

A complete FastAPI web scraping notification system that monitors the HSTU notice page and emails subscribers when a new notice is published.

## Features

- Scrapes HSTU notices from `https://hstu.ac.bd/page/notice_all`
- Detects and stores only new notices by comparing `notice_id`
- Sends email notification to all subscribers on each new notice
- Runs scraper every 10 minutes using APScheduler
- Stores data in PostgreSQL via SQLAlchemy
- Provides subscription and notice APIs
- Includes a clean TailwindCSS frontend
- Ready for deployment on free platforms like Render or Railway

## Project Structure

```text
app/
  main.py
  database.py
  models.py
  schemas.py
  scraper.py
  scheduler.py
  email_service.py
  routers/
    users.py
    notices.py
frontend/
  index.html
requirements.txt
.env.example
README.md
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/hstu_notice_mailer

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@example.com
SMTP_USE_TLS=true
```

## Run Locally

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Ensure PostgreSQL is running and `DATABASE_URL` is correct.
4. Start the app:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

5. Open in browser:

- Frontend: `http://127.0.0.1:8000/`
- Health check: `http://127.0.0.1:8000/health`

## API Endpoints

- `POST /subscribe`
  - Body:

```json
{
  "email": "user@example.com"
}
```

- `GET /notices?limit=20`
  - Returns latest notices from database.

- `GET /`
  - Serves frontend.

## Scheduler Behavior

- A background job runs every 10 minutes.
- Job flow:
  1. Scrape latest notice page.
  2. Compare with last stored notice.
  3. Save only new notices.
  4. Send emails to all subscribers asynchronously.

## Error Handling

- Duplicate notices are skipped using unique `notice_id`.
- Duplicate subscriber emails return `409 Conflict`.
- Scraping/network failures are logged and safely handled.
- Email sending failures are logged without crashing app.

## Deploy on Render or Railway

### Render

- Create a new Web Service from repository.
- Build command:

```bash
pip install -r requirements.txt
```

- Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Add all required environment variables from `.env.example`.
- Attach a PostgreSQL instance and set `DATABASE_URL`.

### Railway

- Create new project and deploy from repository.
- Add PostgreSQL plugin.
- Set environment variables.
- Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Notes

- If running multiple app instances, each instance can trigger scheduler jobs. For single-job behavior, run only one web instance or separate scheduler worker.
- Scraper parsing logic is defensive to handle minor HTML layout changes on source site.

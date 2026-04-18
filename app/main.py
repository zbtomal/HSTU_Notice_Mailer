import asyncio
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse

from app.database import Base, engine
from app.routers.notices import router as notices_router
from app.routers.users import router as users_router
from app.scheduler import create_scheduler, run_scrape_job

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

FRONTEND_FILE = Path(__file__).resolve().parent.parent / "frontend" / "index.html"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Create tables and start scheduler
    Base.metadata.create_all(bind=engine)

    scheduler = create_scheduler()
    scheduler.start()
    app.state.scheduler = scheduler

    # Run one scrape on startup in the background
    asyncio.create_task(run_scrape_job())

    yield
    
    # Shutdown logic
    scheduler = getattr(app.state, "scheduler", None)
    if scheduler:
        scheduler.shutdown(wait=False)

app = FastAPI(title="HSTU Notice Mailer", version="1.0.0", lifespan=lifespan)

app.include_router(users_router)
app.include_router(notices_router)

@app.get("/")
def root() -> FileResponse:
    return FileResponse(FRONTEND_FILE)

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

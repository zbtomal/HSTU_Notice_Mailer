from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.routers.auth import router as auth_router
from app.routers.scraper import router as scraper_router
from app.routers.users import router as users_router

app = FastAPI(
    title="HSTU Notice Mailer",
    description="Backend API to scrape HSTU notices and mail them to subscribed users.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Logger Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("hstu_notice_mailer")

app.include_router(auth_router, prefix="/api/v1")
app.include_router(scraper_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to HSTU Notice Mailer API!"}

@app.get("/health")
def health_check():
    return {"status": "Healthy"}

@app.exception_handler(Exception)
async def global_exception_handler(req: Request, exc: Exception):
    logger.error(f"An unexpected error occurred: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )

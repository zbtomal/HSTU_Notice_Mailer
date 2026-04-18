import asyncio
import logging
from app.scheduler import run_scrape_job

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("github_action_scraper")

async def main():
    logger.info("Starting manual scrape job from GitHub Action...")
    try:
        await run_scrape_job()
        logger.info("Scrape job completed successfully.")
    except Exception as e:
        logger.error(f"Scrape job failed: {e}")
        exit(1)

if __name__ == "__main__":
    asyncio.run(main())

import requests
import logging
from fastapi import Depends
import crud
from database import SessionLocal
import time

URL = "https://n400itshfa000002-development-apim.azure-api.net/RoadSignals?subscription-key=ce34027e127f4566b931cdfcc5136f0f"

LOGGER = logging.getLogger(__name__)


def fetch_data():
    """
    repsonse = requests.get(URL)
    if repsonse.status_code != 200:
        LOGGER.error("Failed to fetch current status")
        return
    # TODO: Save data in db, we should only save if status changed.
    LOGGER.info(repsonse.json())
    """
    LOGGER.info("Fetching data")
    db = SessionLocal()
    timestamp = str(time.time() * 1000)
    status = "Open"
    crud.store_status(db=db, timestamp=timestamp, status=status)
    LOGGER.info(f"Stored data: Timestamp: {timestamp}, Status: {status}")

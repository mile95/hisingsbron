import requests
import logging
from crud import store_status
import datetime
from random import randrange

URL = "https://n400itshfa000002-development-apim.azure-api.net/RoadSignals?subscription-key=ce34027e127f4566b931cdfcc5136f0f"

LOGGER = logging.getLogger(__name__)

LATEST_STATUS = None


def fetch_data(db):
    global LATEST_STATUS
    """
    repsonse = requests.get(URL)
    if repsonse.status_code != 200:
        LOGGER.error("Failed to fetch current status")
        return
    LOGGER.info(repsonse.json())
    """
    LOGGER.info("Fetching data")
    timestamp = datetime.datetime.now()
    status = generate_fake_data()
    if status != LATEST_STATUS:
        store_status(db=next(db), timestamp=timestamp, status=status)
        LOGGER.info(f"Stored data: Timestamp: {timestamp}, Status: {status}")
        LATEST_STATUS = status
    else:
        LOGGER.info("Ignored storing, no status change.")


def generate_fake_data():
    if randrange(10) < 3:
        return "Closed"
    return "Open"

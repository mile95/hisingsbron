import requests
import logging
# TODO: Move logging setup to app.py when ready.
from logger import setup_logging

URL = "https://n400itshfa000002-development-apim.azure-api.net/RoadSignals?subscription-key=ce34027e127f4566b931cdfcc5136f0f"

setup_logging()
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

import boto3
import logging
import time

from botocore.config import Config

LOGGER = logging.getLogger(__name__)
SESSION = boto3.Session()
DATABASE_NAME = "hisingsbridge"
TABLE_NAME = "hisingsbridge"

CLIENT_CONFIG = Config(
    read_timeout=20, max_pool_connections=5000, retries={"max_attempts": 10}
)

CLIENT_WRITE = SESSION.client("timestream-write", config=CLIENT_CONFIG)

CLIENT_QUERY = SESSION.client("timestream-query")

def write_record(timestamp, value):
    LOGGER.info("Writing records")
    dimensions = [
        {"Name": "bridge", "Value": "hisingsbron"},
    ]
    records = [
        {
            "Dimensions": dimensions,
            "MeasureName": "HisingsbridgeStatus",
            "MeasureValue": value,
            "MeasureValueType": "VARCHAR",
            "Time": str(int(timestamp) * 1000),
        }
    ]

    try:
        result = CLIENT_WRITE.write_records(
            DatabaseName=DATABASE_NAME,
            TableName=TABLE_NAME,
            Records=records,
            CommonAttributes={},
        )
        result_status_code = result["ResponseMetadata"]["HTTPStatusCode"]
        LOGGER.info(f"Writing ended with status {result_status_code}")
    except CLIENT_WRITE.exceptions.RejectedRecordsException as err:
        LOGGER.exception("Failed to write to database")


def run_query(sql_query):
    pages = []
    try:
        page_iterator = CLIENT_QUERY.get_paginator('query').paginate(QueryString=sql_query)
        for page in page_iterator:
            pages.append(page)
    except Exception as err:
        print("Exception while running query:", err)
    return pages

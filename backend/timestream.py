# https://github.com/awslabs/amazon-timestream-tools/blob/30558f8134828cc15d1fb50f9b762ccc6b319f1b/sample_apps/python/CrudAndSimpleIngestionExample.py#L5

import boto3
import time

from botocore.config import Config

session = boto3.Session()

DATABASE_NAME = "hisingsbridge"
TABLE_NAME = "hisingsbridge"

write_client = session.client(
    "timestream-write",
    config=Config(
        read_timeout=20, max_pool_connections=5000, retries={"max_attempts": 10}
    ),
)

query_client = session.client("timestream-query")

try:
    print("Creating database")
    write_client.create_database(DatabaseName=DATABASE_NAME)
except write_client.exceptions.ConflictException:
    print("Database already exists")
except Exception as e:
    print("Failed to create database", e)


def list_tables():
    print("Listing tables")
    try:
        result = write_client.list_tables(DatabaseName=DATABASE_NAME, MaxResults=5)
        print(result["Tables"])
        next_token = result.get("NextToken", None)
        while next_token:
            result = write_client.list_tables(
                DatabaseName=DATABASE_NAME, NextToken=next_token, MaxResults=5
            )
            print(result["Tables"])
            next_token = result.get("NextToken", None)
    except Exception as err:
        print("List tables failed:", err)


def write_records():
    print("Writing records")

    current_time = str(int(round(time.time() * 1000)))

    dimensions = [
        {"Name": "region", "Value": "eu-central-1"},
    ]

    status = [
        {
            "Dimensions": dimensions,
            "MeasureName": "HisingsbridgeStatus",
            "MeasureValue": "open",
            "MeasureValueType": "VARCHAR",
            "Time": current_time,
        }
    ]

    try:
        result = write_client.write_records(
            DatabaseName=DATABASE_NAME,
            TableName=TABLE_NAME,
            Records=status,
            CommonAttributes={},
        )
        print(
            "WriteRecords Status: [%s]" % result["ResponseMetadata"]["HTTPStatusCode"]
        )
    except write_client.exceptions.RejectedRecordsException as err:
        print(err)
    except Exception as err:
        print("Error:", err)


# See records ingested into this table so far
SELECT_ALL = f"SELECT * FROM {DATABASE_NAME}.{TABLE_NAME}"


def run_query(query_string):
    try:
        page_iterator = query_client.get_paginator('query').paginate(QueryString=query_string)
        for page in page_iterator:
            print(page)
    except Exception as err:
        print("Exception while running query:", err)


list_tables()
write_records()
run_query(SELECT_ALL)

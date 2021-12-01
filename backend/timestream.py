# https://github.com/awslabs/amazon-timestream-tools/blob/30558f8134828cc15d1fb50f9b762ccc6b319f1b/sample_apps/python/CrudAndSimpleIngestionExample.py#L5

import requests
import boto3
import time

from botocore.config import Config
from datetime import date, datetime

session = boto3.Session()

DATABASE_NAME = "hisingsbridge"
TABLE_NAME = "hisingsbridge"

write_client = session.client(
    "timestream-write",
    config=Config(
        read_timeout=20, max_pool_connections=5000, retries={"max_attempts": 10}
    ),
)

def get_data_to_write():
    response = requests.get("https://hisingsbron.freedynamicdns.org//history?from_date=2021-01-01&to_date=2021-12-24")
    return response.json()


def write_records(entries):
    print("Writing records")

    parts = [entries[i:i+50] for i in range(0,len(entries),50)]

    for part in parts:
        records = []
        for entry in part:
            ts = str(int(round(datetime.fromisoformat(entry['timestamp']).timestamp()* 1000)))
            dimensions = [
                {"Name": "region", "Value": "eu-central-1"},
            ]

            record = {
                    "Dimensions": dimensions,
                    "MeasureName": "HisingsbridgeStatus",
                    "MeasureValue": entry['status'],
                    "MeasureValueType": "VARCHAR",
                    "Time": ts,
            }
            records.append(record)

        try:
            result = write_client.write_records(
                DatabaseName=DATABASE_NAME,
                TableName=TABLE_NAME,
                Records=records,
                CommonAttributes={},
            )
            print(
                "WriteRecords Status: [%s]" % result["ResponseMetadata"]["HTTPStatusCode"]
            )
        except write_client.exceptions.RejectedRecordsException as err:
            print(err)
        except Exception as err:
            print("Error:", err)



#entries = get_data_to_write()

ts = "2021-11-04T04:44:21.290729"
print(datetime.fromisoformat(ts).timestamp())


write_records(get_data_to_write())

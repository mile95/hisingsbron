from sqlalchemy.orm import Session
from datetime import date
from database import write_record, run_query


def store_status(timestamp: str, status: str):
    write_record(timestamp, status)

def get_latest_status():
    query = f'SELECT "measure_value::varchar", "time" FROM hisingsbridge.hisingsbridge ORDER BY time DESC LIMIT 1'
    result = run_query(query)
    return parse_query_result(result[0]['Rows'][0])

def get_historical_records(time_since):
    query = f'SELECT "measure_value::varchar", "time" FROM hisingsbridge.hisingsbridge WHERE time >= AGO({time_since}) ORDER BY time DESC'
    result_pages = run_query(query)
    data = []
    for page in result_pages:
        for row in page["Rows"]:
            data.append(parse_query_result(row)) 
    return data


def parse_query_result(row):
    value = row["Data"][0].get("ScalarValue")
    timestamp = row["Data"][1].get("ScalarValue")
    return {"timestamp": timestamp, "status": value}

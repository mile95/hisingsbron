from sqlalchemy.orm import Session
from datetime import date

from models import Status
from database2 import write_record, run_query

def store_status(timestamp: str, status: str):
    write_record(timestamp, status)


def get_latest_status(db: Session):
    return db.query(Status).order_by(Status.timestamp.desc()).first()


def get_history_between_dates(db: Session, from_date: date, to_date: date):
    return (
        db.query(Status)
        .filter(Status.timestamp.between(str(from_date), str(to_date)))
        .all()
    )

def get_historical_records(time_since):
    query = f'SELECT "measure_value::varchar", "time" FROM hisingsbridge.hisingsbridge WHERE time >= AGO({time_since}) ORDER BY time DESC'
    result_pages = run_query(query)
    for page in result_pages:
        parse_query_result(page)

def parse_query_result(query_result):
    rows = query_result['Rows']
    print(rows)
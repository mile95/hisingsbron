from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.sql.sqltypes import Date

from database import Base


class Status(Base):
    __tablename__ = "status"

    timestamp = Column(String, primary_key=True)
    status = Column(String)

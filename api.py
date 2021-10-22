import mysql.connector
import os

def call_proc(name, args=()):
    db = mysql.connector.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD")
    )
    cursor = db.cursor()
    cursor.callproc(name, args)
    db.commit()
    result = None
    for output in cursor.stored_results():
        result = output
        break
    return result


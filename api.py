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
    result = next(cursor.stored_results())
    columns = [data[0] for data in result.description]
    output = []
    for row in result.fetchall():
        output.append(dict(zip(columns, row)))
    return output

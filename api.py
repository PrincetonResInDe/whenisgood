import mysql.connector
import os

def call_proc(name, args=()):
    try:
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
        for stored_result in cursor.stored_results():
            result = stored_result
            break
        output = []
        if result:
            columns = [data[0] for data in result.description]
            for row in result.fetchall():
                output.append(dict(zip(columns, row)))
        return output
    except:
        return [{"result": "failure"}]
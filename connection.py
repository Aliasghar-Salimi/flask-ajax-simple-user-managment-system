import sqlite3

def connect():
    connection = sqlite3.connect('/home/ali-user/tmp/js/editable_table/sampledb.db')

    create_table = """create table if not exists users (
    	            `id`	INTEGER NOT NULL UNIQUE,
                    `full_name` text,
                    `phone` text,
                    `delete_date` text,
    	            PRIMARY KEY("id" AUTOINCREMENT)
                    )"""
    connection.execute(create_table)
    connection.commit()

    return connection


import sqlite3
import fastapi

def CreateDB():
    with ConnectionDB():
            
        ConnectionDB = sqlite3.connect("task.db")
        cursor = sqlite3.Cursor()

        cursor.execute()
        output = cursor.fetchall()
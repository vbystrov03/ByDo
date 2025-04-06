import fastapi
import sqlite3, logging
import requests



app = fastapi.FastAPI()

@app.get("/users")
def SelectAllFromDB():
    try:
        ConnectionDB = sqlite3.connect("auth.db")
        cursor = ConnectionDB.cursor()
        cursor.execute("""SELECT * FROM Auth""")
        users = cursor.fetchall()
        ConnectionDB.close()
        return {"users": users}  # Возвращаем список пользователей
    except sqlite3.Error as e:
        print(f"[Error] SelectAllFromDB: {e}")
        return {"error": f"Ошибка при получении списка пользователей: {e}"}


def CreateAuthDB():
    ConnectionDB = sqlite3.connect("auth.db")
    cursor = ConnectionDB.cursor()

    AuthSQL = open('./Auth-ToDo/AuthDB.sql', 'r')
    AuthSQL = AuthSQL.read()

    cursor.execute(AuthSQL)

    ConnectionDB.commit()
    ConnectionDB.close()

@app.get("/")
def HealthyCheck():
    try:
        return {"health": "ok"}
    except:
        return {"Error": "Service dont working"}
    
@app.post("/useradd")
async def AddCredToAuthDB(request: fastapi.Request, login: str = fastapi.Form(...), password: str = fastapi.Form(...)):
    try:
        ConnectionDB = sqlite3.connect("auth.db")
        cursor = ConnectionDB.cursor()

        cursor.execute(
            "INSERT INTO Auth (login, password) VALUES (?, ?)", (login, password)
        )

        ConnectionDB.commit()
        ConnectionDB.close()

        return {"message": f"Пользователь {login} успешно добавлен"}
    except sqlite3.Error as e:
        print(f"[Error] AddCredToAuthDB: {e}")
        return {"error": "Произошла ошибка при добавлении пользователя"}

def RemoveCredFromAuthDB():
    ConnectionDB = sqlite3.connect("./Auth-ToDo/auth.db")
    cursor = ConnectionDB.cursor()

    cursor.execute("")

    ConnectionDB.commit()
    ConnectionDB.close()
    
# CreateAuthDB()
# AddCredToAuthDB()
# SelectAllFromDB()
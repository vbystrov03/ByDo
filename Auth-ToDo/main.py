import fastapi
import sqlite3, logging
import uvicorn
import bcrypt, os, sys

app = fastapi.FastAPI()

@app.get("/users")
def SelectAllFromDB():
    try:
        ConnectionDB = sqlite3.connect("auth.db")
        cursor = ConnectionDB.cursor()
        cursor.execute("""SELECT * FROM Auth""")
        users = cursor.fetchall()
        ConnectionDB.close()
        return {"users": users}
    except sqlite3.Error as e:
        print(f"[Error] SelectAllFromDB: {e}")
        return {"error": f"Ошибка при получении списка пользователей: {e}"}


def CreateAuthDB():
    ConnectionDB = sqlite3.connect("auth.db")
    cursor = ConnectionDB.cursor()

    AuthSQL = open('./AuthDB.sql', 'r')
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
        password = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hpassword = bcrypt.hashpw(password, salt)
        cursor.execute("INSERT INTO Auth (login, password) VALUES (?, ?)", (login, hpassword))
        ConnectionDB.commit()
        ConnectionDB.close()
        return {"message": f"Пользователь {login} успешно добавлен"}
    except sqlite3.Error as e:
        print(f"[Error] AddCredToAuthDB: {e}")
        return {"error": "Произошла ошибка при добавлении пользователя"}


def RemoveCredFromAuthDB():
    ConnectionDB = sqlite3.connect("./auth.db")
    cursor = ConnectionDB.cursor()

    cursor.execute("")

    ConnectionDB.commit()
    ConnectionDB.close()

@app.post("/usercheck")
def check_cred_from_auth_db(login: str = fastapi.Form(...), password: str = fastapi.Form(...)):
    try:
        with sqlite3.connect("auth.db") as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT password FROM Auth WHERE login = ?", (login,))
            result = cursor.fetchone()
            return  {"message": result}

    except Exception as e:
        raise fastapi.HTTPException(status_code=500, detail=str(e))


if not os.path.exists("auth.db"):
    CreateAuthDB()
uvicorn.run(app, host="0.0.0.0", port=10000)
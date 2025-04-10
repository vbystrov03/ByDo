import fastapi
import sqlite3, logging
import uvicorn
import bcrypt, os, sys
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta

#Для генерации токена 
SECRET_KEY = "qwertyuiopasdfghjklzxcvbnm"
ALGORITHM="HS256"

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#------------------------------------------------------------------------
# Управление токенами(JWT)
#------------------------------------------------------------------------
def Create_JWT_Token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})  # Добавляем в токен время истечения срока действия
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Подписываем данные
    return encoded_jwt

@app.get("/users")
def SelectAllFromDB():
    try:
        with sqlite3.connect("auth.db") as ConnectionDB:
            ConnectionDB = sqlite3.connect("auth.db")
            cursor = ConnectionDB.cursor()
            cursor.execute("""SELECT * FROM Auth""")
            users = cursor.fetchall()
            return {"users": users}
    except sqlite3.Error as e:
        print(f"[Error] SelectAllFromDB: {e}")
        return {"error": f"Ошибка при получении списка пользователей: {e}"}


def CreateAuthDB():
    with sqlite3.connect("auth.db") as ConnectionDB:
        cursor = ConnectionDB.cursor()

        AuthSQL = open('./AuthDB.sql', 'r')
        AuthSQL = AuthSQL.read()

        cursor.execute(AuthSQL)



@app.get("/")
def HealthyCheck():
    try:
        with sqlite3.connect("auth.db") as ConnectionDB:
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
            if result:
                stored_hash = result[0]
                is_valid = bcrypt.checkpw(password.encode("utf-8"), stored_hash)
                if is_valid:
                    token_data = {"sub": login}
                    token = Create_JWT_Token(token_data)
                    return {"message":"Верный пароль", "access_token": token, "token_type": "bearer"}
                else:
                    return {"error": "Неверный пароль"}
            else:
                return {"error": "Пользователь не найден"}
    except Exception as e:
        raise fastapi.HTTPException(status_code=500, detail=str(e))


if not os.path.exists("auth.db"):
    CreateAuthDB()
uvicorn.run(app, host="0.0.0.0", port=10000)
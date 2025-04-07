import bcrypt


# Генерация хеша
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(b"my_password", salt)

# Проверка
is_valid = bcrypt.checkpw(b"my_passwor", hashed)  # True/False
print(hashed)
print(is_valid)
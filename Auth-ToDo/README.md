# Auth-ToDo
### Сервис, который отвечает за аутентификацию, регистрацию, смена пароля и тд.

### Cборка сервиса в docker 

docker build -t auth-service .

### Запуск сервиса
docker run -d -p 10000:10000 auth-service
### Запуск api сервера

uvicorn main:app --reload
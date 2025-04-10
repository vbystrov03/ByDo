const API_URL = "http://localhost:10000";

function showRegisterForm() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('register-container').style.display = 'none';
}

async function login() {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  if (login && password) {
    try {
      const formData = new URLSearchParams();
      formData.append("login", login);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/usercheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токен в localStorage
        localStorage.setItem('access_token', data.access_token);

        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('task-container').style.display = 'block';
        document.getElementById('service-description').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        alert('Вход выполнен успешно!');
      } else {
        alert(data.message || 'Ошибка входа!');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Ошибка сети. Попробуйте позже.');
    }
  } else {
    alert('Пожалуйста, введите логин и пароль!');
  }
}

async function register() {
  const newLogin = document.getElementById('new-login').value;
  const newPassword = document.getElementById('new-password').value;

  if (newLogin && newPassword) {
    try {
      const formData = new URLSearchParams();
      formData.append("login", newLogin);
      formData.append("password", newPassword);

      const response = await fetch(`${API_URL}/useradd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Регистрация успешна!');
        showLoginForm();
      } else {
        alert(data.message || 'Ошибка регистрации!');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Ошибка сети. Попробуйте позже.');
    }
  } else {
    alert('Пожалуйста, введите логин и пароль!');
  }
}

function logout() {
  // Удаляем токен при выходе
  localStorage.removeItem('access_token');  

  document.getElementById('task-container').style.display = 'none';
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('service-description').style.display = 'block';
  document.getElementById('calendar-container').style.display = 'none';
}

async function fetchProtectedData() {
  const token = localStorage.getItem('access_token');  // Получаем токен из localStorage

  if (token) {
    try {
      const response = await fetch(`${API_URL}/protected_route`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data); // Обрабатываем ответ от защищенного маршрута
    } catch (error) {
      console.error('Ошибка при запросе защищенного маршрута:', error);
    }
  } else {
    alert('Токен не найден. Пожалуйста, авторизуйтесь.');
  }
}

function addTask() {
  const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const day = prompt("В какой день добавить задачу? (пн, вт, ср, чт, пт, сб, вс)").toLowerCase();
  const text = prompt("Введите текст задачи:");

  const dayMap = {
    "пн": "mon", "вт": "tue", "ср": "wed", "чт": "thu",
    "пт": "fri", "сб": "sat", "вс": "sun"
  };

  if (text && dayMap[day]) {
    const task = document.createElement('div');
    task.className = 'task';
    task.textContent = text;
    document.getElementById(dayMap[day]).appendChild(task);
  } else {
    alert("Неверный день недели!");
  }
}

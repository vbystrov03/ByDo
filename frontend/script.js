const API_URL = "http://localhost:10000";  // Замените на адрес вашего FastAPI сервера

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
      const response = await fetch(`${API_URL}/usercheck`, {  // Здесь указываем API URL для логина
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: login, password: password })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Если вход успешен, скрываем формы и показываем задачи и календарь
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
      const response = await fetch(`${API_URL}/useradd`, {  // Здесь указываем API URL для регистрации
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newLogin, password: newPassword })
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
  document.getElementById('task-container').style.display = 'none';
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('service-description').style.display = 'block';
  document.getElementById('calendar-container').style.display = 'none';
}

function addTask() {
  alert('Задача добавлена');
}

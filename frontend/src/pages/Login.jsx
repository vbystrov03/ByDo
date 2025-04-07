import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:10000/usercheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        login: login,
        password: password,
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert("Успешный вход!");
      navigate("/tasks"); // Перенаправление на страницу задач
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="auth-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          name="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
      <p>
        Еще не зарегистрированы? <a href="/register">Зарегистрироваться</a>
      </p>
    </div>
  );
};

export default Login;

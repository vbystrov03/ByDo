import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:10000/useradd", {
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
      alert(data.message);
      navigate("/login");
    } else {
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="register-login">Логин:</label>
        <input
          type="text"
          id="register-login"
          name="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <label htmlFor="register-password">Пароль:</label>
        <input
          type="password"
          id="register-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
};

export default Register;

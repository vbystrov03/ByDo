import React from "react";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Для примера, просто перенаправим на страницу входа
    navigate("/login");
  };

  return (
    <div className="tasks-container">
      <h2>Домашняя страница - Задачи</h2>
      <button onClick={handleLogout}>Выйти</button>

      <div className="task-list">
        <p>Здесь будут отображаться ваши задачи.</p>
        {/* Добавьте логику для отображения задач, например, из состояния */}
      </div>
    </div>
  );
};

export default Tasks;

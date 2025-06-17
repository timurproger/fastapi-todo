import { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (token: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Ответ от сервера:", data);

      if (response.ok && data.access_token) {
        
        onLogin(data.access_token);
      } else {
        alert("❌ Ошибка: " + (data.detail || "Неверные данные"));
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("❌ Ошибка сети");
    }
  };

  return (
    <div className="container-login100">
      <div className="wrap-login100">
        <form
          className="login100-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <span className="login100-form-title">Вход</span>

          <div className="wrap-input100">
            <input
              className="input100"
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="focus-input100"></span>
          </div>

          <div className="wrap-input100">
            <input
              className="input100"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="focus-input100"></span>
          </div>

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="submit">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

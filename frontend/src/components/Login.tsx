import { useState, useEffect } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (token: string) => void;
  onShowRegister: () => void;
}

function Login({ onLogin, onShowRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        onLogin(data.access_token);
      } else {
        setMessage("❌ Ошибка: " + (data.detail || "Неверные данные"));
      }
    } catch (error) {
      setMessage("❌ Ошибка сети");
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
          <span className="login100-form-title">Login</span>

          {/* Уведомление */}
          {message && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "15px",
                textAlign: "center",
                fontSize: "14px",
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              {message}
            </div>
          )}

          <div className="wrap-input100">
            <input
              className="input100"
              type="text"
              placeholder="username"
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
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="focus-input100"></span>
          </div>

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="submit">
              Login
            </button>
          </div>

          {/* Кнопка для переключения на регистрацию */}
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button
              type="button"
              onClick={onShowRegister}
              style={{
                background: "transparent",
                border: "none",
                color: "#999",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                margin: 0,
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

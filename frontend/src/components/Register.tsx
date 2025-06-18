import { useState, useEffect } from "react";
import "./Register.css";

interface RegisterProps {
  onShowLogin: () => void;
}

function Register({ onShowLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      showMessage("❗ Заполните все поля.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/auth/register", { // изменено на относительный путь
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Успешная регистрация", "success");
        setUsername("");
        setPassword("");
      } else {
        const messages = Array.isArray(data.detail)
          ? data.detail.map((e: any) => e.msg || e).join("\n")
          : data.detail;
        showMessage("❌ Ошибка: " + messages, "error");
      }
    } catch (error) {
      showMessage("❌ Ошибка сети", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div
        className="container-register100"
        style={{ backgroundImage: `url("/images/bg-01.jpg")` }}
      >
        <div className="wrap-register100">
          <form className="register100-form" onSubmit={(e) => e.preventDefault()}>
            <span className="register100-form-title">Register</span>

            {/* Уведомление */}
            {message && (
              <div
                style={{
                  backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  border: "1px solid",
                  borderColor: messageType === "success" ? "#c3e6cb" : "#f5c6cb",
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

            <div className="container-register100-form-btn">
              <button
                type="button"
                className="register100-form-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Sign Up"}
              </button>
            </div>

            {/* Кнопка назад к логину */}
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <button
                type="button"
                onClick={onShowLogin}
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
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

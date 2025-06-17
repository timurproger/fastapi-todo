import { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      alert("❗ Заполните все поля.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Успешная регистрация");
        setUsername("");
        setPassword("");
      } else {
        const messages = Array.isArray(data.detail)
          ? data.detail.map((e: any) => e.msg || e).join("\n")
          : data.detail;
        alert("❌ Ошибка:\n" + messages);
      }
    } catch (error) {
      alert("❌ Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div className="container-register100" style={{ backgroundImage: `url("/images/bg-01.jpg")` }}>
        <div className="wrap-register100">
          <form className="register100-form">
            <span className="register100-form-title">Login</span>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                {loading ? "Загрузка..." : "sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем токен из localStorage, если есть
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLoginSuccess = (jwtToken: string) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowRegister(false);
  };

  if (token) {
    return <Tasks token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="app-container">
      <div className="left-side">
        {showRegister ? (
          <Register onShowLogin={() => setShowRegister(false)} />
        ) : (
          <Login
            onLogin={handleLoginSuccess}
            onShowRegister={() => setShowRegister(true)}
          />
        )}
      </div>
      <div className="right-side">
        {/* Можно здесь убрать эту кнопку, т.к. она теперь внутри форм */}
      </div>
    </div>
  );
}

export default App;

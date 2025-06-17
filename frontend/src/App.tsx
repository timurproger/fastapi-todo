import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (jwtToken: string) => {
    setToken(jwtToken);
  };

  if (token) {
    return <Tasks token={token} />;
  }

  return (
    <div className="app-container">
      <div className="left-side">
        {showRegister ? (
          <Register />
        ) : (
          <Login onLogin={handleLoginSuccess} />
        )}
      </div>
      <div className="right-side">
        {!showRegister ? (
          <button
            className="sign-up-btn"
            onClick={() => setShowRegister(true)}
          >
            Sign Up
          </button>
        ) : (
          <button
            className="sign-up-btn"
            onClick={() => setShowRegister(false)}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

// src/pages/StartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StartPage.css"; // make sure filename matches casing

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="start-container">
      <div className="start-card">
        <h1 className="start-title">🔥 LLM Wars</h1>
        <p className="start-subtitle">Choose your game mode</p>
        <div className="button-group">
          <button onClick={() => navigate("/single")} className="start-button">
            Single Player
          </button>
          <button onClick={() => navigate("/multi")} className="start-button">
            Multiplayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;

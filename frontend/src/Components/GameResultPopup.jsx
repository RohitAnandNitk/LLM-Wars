// src/components/GameResultPopup.jsx
import React from "react";
import "./GameResultPopup.css"; // CSS will be in the same folder or styles folder

const GameResultPopup = ({ gameResult, onRematch, onExit }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Game Over</h2>
        <p>
          {gameResult === "won"
            ? "🎉 You won the game!"
            : "😢 You lost the game!"}
        </p>
        <div className="popup-actions">
          <button onClick={onRematch}>🔁 Rematch</button>
          <button onClick={onExit}>🚪 Exit</button>
        </div>
      </div>
    </div>
  );
};

export default GameResultPopup;

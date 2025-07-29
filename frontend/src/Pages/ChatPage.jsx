import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import { getCompanyGuess } from "../APIs/api.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import socket from "../SocketIO/socketio.jsx";

import microsoft from "../assets/microsoft.png";
import google from "../assets/google.png";
import apple from "../assets/apple.png";
import tesla from "../assets/tesla.png";
import amazon from "../assets/amazon.png";

// Arrays for images and correct answers
const companyImages = [google, apple, tesla, microsoft, amazon];
const companyAnswers = ["Google", "Apple", "Tesla", "Microsoft", "Amazon"];

const ChatPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const playerName = location.state?.playerName ?? "";
  const initialImageIndex = location.state?.imageIndex ?? null;
  const [imageIndex, setImageIndex] = useState(initialImageIndex);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("Groq");
  const [isCorrect, setIsCorrect] = useState(false); // flag if game is won
  const [gameResult, setGameResult] = useState(""); // "won" or "lost"

  const handleRematch = () => {
    socket.emit("rematch", { roomId }); // backend will reset game for room
    setShowGameOverPopup(false); // close popup
  };

  const handleExit = () => {
    socket.emit("leave_room", { roomId });
    navigate("/"); // go back to home
  };

  const handleSend = async () => {
    if (!input.trim() || isCorrect) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const guess = await getCompanyGuess(input, model.toLowerCase());
      const botMessage = { role: "assistant", content: guess };
      setMessages((prev) => [...prev, botMessage]);

      // Compare with correct answer
      const correctAnswer = companyAnswers[imageIndex];
      if (guess.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        setIsCorrect(true);

        // 👇 Emit to backend that someone has won
        socket.emit("game_won", {
          roomId: roomId,
          winner: playerName,
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `🎉 Correct! It's ${correctAnswer}. You win!`,
          },
        ]);
        setShowGameOverPopup(true);
      }
    } catch (error) {
      console.error("Error fetching guess:", error);
      const errorMessage = {
        role: "assistant",
        content: "❌ Failed to get guess. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  useEffect(() => {
    // GAME OVER listener
    socket.on("game_over", (data) => {
      setIsCorrect(true); // disable input

      const result = data.winner === playerName ? "won" : "lost";
      setGameResult(result);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `🎉 Game Over! ${data.winner} won!`,
        },
      ]);

      setShowGameOverPopup(true); // ✅ Show popup to all players
    });

    // ✅ REMATCH listener
    socket.on("rematch", (data) => {
      const { imageIndex: newImageIndex } = data;

      setImageIndex(newImageIndex);
      setMessages([]);
      setInput("");
      setIsCorrect(false);
      setGameResult("");
      setShowGameOverPopup(false);
    });

    return () => {
      socket.off("game_over");
      socket.off("rematch"); // clean up listener
    };
  }, []);

  const logoImage = imageIndex !== null ? companyImages[imageIndex] : null;

  return (
    <div className="game-wrapper">
      {/* LEFT SIDE: Logo */}
      <div className="logo-section">
        {logoImage && (
          <img src={logoImage} alt="Company Logo" className="logo-img" />
        )}
      </div>

      {/* RIGHT SIDE: Chat */}
      <div className="chat-section">
        <h2 className="title">🧠 LLM Wars</h2>

        <div className="dropdown">
          <label htmlFor="model">Select Model:</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Enter company clue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isCorrect}
          />
          <button onClick={handleSend} disabled={isCorrect}>
            Send
          </button>
        </div>
      </div>

      {/* GAME OVER POPUP */}
      {showGameOverPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Game Over</h2>
            <p>
              {gameResult === "won"
                ? "🎉 You won the game!"
                : "😢 You lost the game!"}
            </p>
            <div className="popup-actions">
              <button onClick={handleRematch}>🔁 Rematch</button>
              <button onClick={handleExit}>🚪 Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

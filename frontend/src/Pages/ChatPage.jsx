import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import { getCompanyGuess, verifyClueIsFair } from "../APIs/api.jsx";
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

  const normalize = (text) => {
    console.log("Normalizing input:", text);
    return text.toLowerCase().replace(/[^a-z]/g, ""); // remove non-alphabet chars
  };

  const handleSend = async () => {
    console.log("Sending message:", input);
    if (!input.trim() || isCorrect) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const correctAnswer = companyAnswers[imageIndex];
    const normalizedInput = normalize(input);
    const normalizedAnswer = normalize(correctAnswer);

    console.log("Normalized input:", normalizedInput);
    console.log("Normalized answer:", normalizedAnswer);

    // Basic client-side block
    if (normalizedInput.includes(normalizedAnswer)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Invalid clue. Please avoid using the company's name directly or in disguised form.",
        },
      ]);
      setInput("");
      return;
    }

    try {
      // Step 1: Get guess
      const guess = await getCompanyGuess(input, model.toLowerCase());
      const normalizedGuess = normalize(guess);
      const isCorrectGuess = normalizedGuess === normalizedAnswer;

      // Step 2: If correct, check clue fairness
      if (isCorrectGuess) {
        const isFair = await verifyClueIsFair(input, correctAnswer, model);

        if (!isFair) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "⚠️ Invalid clue detected. It seems like the clue revealed the company name directly or in disguised form. Try again.",
            },
          ]);
          setInput("");
          return;
        }

        // Emit winner — actual popup will be shown in socket listener
        setIsCorrect(true);
        socket.emit("game_won", {
          roomId,
          winner: playerName,
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: guess },
          {
            role: "assistant",
            content: `🎉 Correct! It's ${correctAnswer}. You win!`,
          },
        ]);
      } else {
        // Wrong guess
        setMessages((prev) => [...prev, { role: "assistant", content: guess }]);
      }
    } catch (error) {
      console.error("Error fetching guess:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Failed to get guess. Please try again.",
        },
      ]);
    }

    setInput("");
  };

  useEffect(() => {
    // GAME OVER listener
    socket.on("game_over", (data) => {
      setIsCorrect(true);
      const result = data.winner === playerName ? "won" : "lost";
      setGameResult(result);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `🎉 Game Over! ${data.winner} won!`,
        },
      ]);

      if (data.winner === playerName) {
        setTimeout(() => {
          setShowGameOverPopup(true);
        }, 2000); // Delay for winner
      } else {
        setShowGameOverPopup(true); // Immediate for others
      }
    });

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
      socket.off("rematch");
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

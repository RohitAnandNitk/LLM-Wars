import React, { useState } from "react";
import "./SinglePlayerPage.css";
import { getCompanyGuess, verifyClueIsFair } from "../APIs/api.jsx";
import GameResultPopup from "../Components/GameResultPopup";

import microsoft from "../assets/microsoft.png";
import google from "../assets/google.png";
import apple from "../assets/apple.png";
import tesla from "../assets/tesla.png";
import amazon from "../assets/amazon.png";

const companyImages = [google, apple, tesla, microsoft, amazon];
const companyAnswers = ["Google", "Apple", "Tesla", "Microsoft", "Amazon"];

const SinglePlayerPage = () => {
  const [imageIndex, setImageIndex] = useState(
    Math.floor(Math.random() * companyImages.length)
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("Groq");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");

  const correctAnswer = companyAnswers[imageIndex];

  const normalize = (text) => text.toLowerCase().replace(/[^a-z]/g, "");

  const handleSend = async () => {
    if (!input.trim() || gameOver) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const normalizedInput = normalize(input);
    const normalizedAnswer = normalize(correctAnswer);

    if (normalizedInput.includes(normalizedAnswer)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Invalid clue. Don't reveal or hint at the company name directly!",
        },
      ]);
      setInput("");
      return;
    }

    try {
      const guess = await getCompanyGuess(input, model.toLowerCase());
      const normalizedGuess = normalize(guess);

      if (normalizedGuess === normalizedAnswer) {
        const isFair = await verifyClueIsFair(input, correctAnswer, model);

        if (!isFair) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "⚠️ That clue gives away the answer. Try a more challenging clue.",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: guess },
            {
              role: "assistant",
              content: `🎉 Correct! It's ${correctAnswer}. You win!`,
            },
          ]);
          // set timiout for two seconds
          setResult("won");
          setTimeout(() => {
            setGameOver(true);
            // setResult("won");
          }, 2000);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: guess }]);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error getting response. Try again." },
      ]);
    }

    setInput("");
  };

  const handleRematch = () => {
    setImageIndex(Math.floor(Math.random() * companyImages.length));
    setMessages([]);
    setInput("");
    setGameOver(false);
    setResult("");
  };

  const handleExit = () => {
    window.location.href = "/"; // or use navigate("/") if you're using react-router
  };

  return (
    <div className="single-wrapper">
      <div className="logo-section">
        <img
          src={companyImages[imageIndex]}
          alt="Company Logo"
          className="logo-img"
        />
      </div>

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
            placeholder="Enter a clue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={gameOver}
          />
          <button onClick={handleSend} disabled={gameOver}>
            Send
          </button>
        </div>
      </div>

      {/* Game Over Popup */}
      {gameOver && (
        <GameResultPopup
          gameResult={result}
          onRematch={handleRematch}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default SinglePlayerPage;

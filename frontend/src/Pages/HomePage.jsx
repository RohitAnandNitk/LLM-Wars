import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">🧠 LLM Wars</h1>
      <div className="home-buttons">
        <button onClick={() => navigate("/create-room")}>Create Room</button>
        <button onClick={() => navigate("/join-room")}>Join Room</button>
      </div>
    </div>
  );
};

export default HomePage;

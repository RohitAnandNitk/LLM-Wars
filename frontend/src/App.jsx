import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import CreateRoom from "./Pages/CreateRoom";
import JoinRoom from "./Pages/JoinRoom";
import SinglePlayerPage from "./Pages/SinglePlayerPage";
import StartPage from "./Pages/StartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/multi" element={<HomePage />} />
        <Route path="/single" element={<SinglePlayerPage />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;

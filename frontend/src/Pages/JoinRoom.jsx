import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../SocketIO/socketio.jsx"; // import socket
import "./JoinRoom.css";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomId.trim() || !playerName.trim()) {
      return alert("Please enter both name and room code");
    }

    // Emit the join_room event to the backend
    socket.emit("join_room", { roomId, username: playerName });

    // Optionally wait for backend confirmation
    socket.on("room_joined", (data) => {
      navigate(`/room/${data.roomId}`, {
        state: {
          playerName: data.username,
          isHost: false,
          imageIndex: data.imageIndex, // ✅ pass index
        },
      });
    });
  };

  useEffect(() => {
    socket.on("error_join", (data) => {
      alert(data.message);
      navigate("/"); // redirect to home or join page
    });

    return () => socket.off("error_join");
  }, []);

  return (
    <div className="join-room-container">
      <div className="join-room-box">
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default JoinRoom;

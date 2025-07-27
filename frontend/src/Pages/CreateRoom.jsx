import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import socket from "../SocketIO/socketio.jsx";
import "./CreateRoom.css";

const CreateRoom = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔌 Setting up socket listener for room_created");

    socket.on("room_created", (data) => {
      alert(`✅ Room created with ID: ${data.roomId}`);

      navigate(`/room/${data.roomId}`, {
        state: {
          playerName: data.username,
          isHost: true,
          imageIndex: data.imageIndex,
        },
      });
    });

    return () => {
      console.log("🧹 Cleaning up room_created listener");
      socket.off("room_created");
    };
  }, []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) return alert("Enter your name");

    const newRoomId = uuidv4();
    console.log("📤 Emitting create_room:", newRoomId);

    socket.emit("create_room", {
      roomId: newRoomId,
      username: playerName,
    });
  };

  return (
    <div className="create-room-container">
      <div className="create-room-box">
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create</button>
      </div>
    </div>
  );
};

export default CreateRoom;

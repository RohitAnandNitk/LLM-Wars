import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"], // Avoid polling issues
//   withCredentials: true,
// });

const socket = io("https://llm-wars.onrender.com", {
  transports: ["websocket"], // Avoid polling issues
  withCredentials: true,
});

export default socket;

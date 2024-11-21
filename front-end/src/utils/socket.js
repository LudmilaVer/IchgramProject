// src/utils/socket.js

import { io } from "socket.io-client";

// Подключение к серверу WebSocket
const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;

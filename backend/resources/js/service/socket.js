import { io } from "socket.io-client";
// const socket = io("http://localhost:3001");
const socket = io("wss://socket.mentorthesis.com", {
    transports: ["websocket", "polling"],
    secure: true
});
export default socket;
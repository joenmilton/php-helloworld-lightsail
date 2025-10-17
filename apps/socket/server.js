require('dotenv').config();
const allowedOrigins = [
    "https://backoffice.mentorthesis.com",
    "https://portal.mentorthesis.com"
];

const io = require("socket.io")(3001, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: false
    }
});
const Redis = require("ioredis");

// Connect to Redis
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379
});

console.log("Listening for Redis events...");

// Subscribe to Laravel's default broadcasting channel pattern
redis.psubscribe("*", (err, count) => {  // Use psubscribe to match all channels
    if (err) {
        console.error("Failed to subscribe:", err);
    } else {
        console.log(`Subscribed to ${count} channel(s).`);
    }
});

// Listen for incoming messages
redis.on("pmessage", (pattern, channel, message) => {
    try {
        let parsedMessage = JSON.parse(message);
        // console.log(`Received from ${channel}:`, parsedMessage);
        // io.emit(channel, parsedMessage);

        // Extract the part that matches "anything.number" pattern
        const regex = /private-([\w-]+\.\d+)$/;
        const match = channel.match(regex);
        
        if (match) {
            const actualChannel = match[1]; // This gives you "user.17" from "mentor_thesis_database_private-user.17"
            console.log("Emitting to channel:", actualChannel);
            io.to(actualChannel).emit('notification.sent', parsedMessage);
            // io.emit('notification.sent', parsedMessage);
        } else {
            console.log("Emitting globally to channel:", channel, "with message:", parsedMessage);
            io.emit(channel, parsedMessage);
        }
    } catch (error) {
        console.error("Error parsing message:", error);
    }
});

// Handle client connection
io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle channel subscriptions
    socket.on('subscribe', (channel) => {
        console.log(`Client subscribing to: ${channel}`);
        socket.join(channel);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { startReservationArchiving } = require("./archives/archivesReservation");
const { csrfProtection } = require("./middleware/csrfProtection");
const { Server } = require("socket.io");

const csrfRoutes = require("./routes/csrfProtectionRoutes");

const userRoutes = require("./routes/userRoutes");
const userProfile = require("./routes/profileRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const productRoutes = require("./routes/productRoutes");
const restockScheduleRoutes = require("./routes/restockScheduleRoutes");
const localShopRoutes = require("./routes/localShopRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const geminiChatbot = require("./routes/geminiAIRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ACLC Stock System API is running",
  });
});

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
  },
});

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", csrfRoutes);
app.use("/api", csrfProtection);
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  //console.log("Socket connected:", socket.id);

  socket.on("join-room", (profileId) => {
    socket.join(profileId);

    console.log(`Socket ${socket.id} joined notification room: ${profileId}`);
  });

  socket.on("leave-room", (profileId) => {
    socket.leave(profileId);

    console.log(`Socket ${socket.id} left notification room: ${profileId}`);
  });

  socket.on("disconnect", () => {
    //console.log("Socket disconnected:", socket.id);
  });
});

app.use("/uploads", express.static("uploads"));
app.use("/api/chatbot", geminiChatbot);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", userProfile);
app.use("/api/products", productRoutes);
app.use("/api/restock-schedules", restockScheduleRoutes);
app.use("/api/local-shops", localShopRoutes);
app.use("/api/reservations", reservationRoutes);

// Connect to the database
const start = async () => {
  try {
    await connectDB();

    startReservationArchiving();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

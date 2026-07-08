const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const messageRoutes =
require("./routes/messageRoutes");
dotenv.config();
connectDB();
const conversationRoutes =
require("./routes/conversationRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
    "/api/messages",
    messageRoutes
);
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LeetMentor API Running 🚀",
  });
});
app.use(
  "/api/conversations",
  conversationRoutes
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
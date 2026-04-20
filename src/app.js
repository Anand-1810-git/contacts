const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const ocrRoutes = require("./routes/ocrRoutes");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);
      const isLocalhostWeb = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalhostWeb) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Smart Contact Manager API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/ocr", ocrRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Unexpected server error" });
});

module.exports = app;

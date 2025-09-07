import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Chat proxy (server-side only) - sends user message to Gemini/Generative API
  try {
    const { handleChat } = await import("./routes/chat").catch(() =>
      require("./routes/chat"),
    );
    app.post("/api/chat", handleChat as any);
  } catch (err) {
    // If dynamic import fails in older runtimes, try static require
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { handleChat } = require("./routes/chat");
    app.post("/api/chat", handleChat);
  }

  return app;
}

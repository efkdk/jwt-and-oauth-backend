import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./router/routes";
import type { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(bodyParser.json());
app.use("/api", router);

const connectToMongoDB = async () => {
  try {
    console.log("Connecting to mongodb...");
    await mongoose.connect(process.env.DB_URI, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

connectToMongoDB();

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};

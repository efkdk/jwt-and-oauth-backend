import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Connected to mongodb");
    app.listen(PORT, () => console.log(`Server is running on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
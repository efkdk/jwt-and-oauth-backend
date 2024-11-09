import mongoose, { Schema } from "mongoose";
import User from "./user";

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: "tokens",
  }
);

const Token = mongoose.model("Token", TokenSchema);

export default Token;

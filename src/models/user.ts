import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, //not required for google Auth
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["jwt", "google"],
      default: "jwt",
      required: true,
    },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;

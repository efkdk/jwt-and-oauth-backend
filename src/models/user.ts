import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    verificationCode: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;

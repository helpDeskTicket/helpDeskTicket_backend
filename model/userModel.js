import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [3, "First name is too short"],
      maxLength: [20, "Name too large"],
      trim: true,
      required: [true, "Please privide a name"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide is valide email"],
      required: [true, "Please provide a email"],
      unique: [true, "Email alredy in use"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
    },
  }
);

const User = mongoose.model("users", userSchema);

export default User;

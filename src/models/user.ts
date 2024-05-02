import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "email is not valid",
    ],
  },
  password: {
    type: String,
    unique: true,
    required: [true, "password is required"],
    select: false,
  },
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    minLength: [3, "Full name must be at least 3 characters"],
    maxLength: [50, "Full name must be at least 50 characters"],
  },
});

const User = models.User || model("User", userSchema);
export default User;

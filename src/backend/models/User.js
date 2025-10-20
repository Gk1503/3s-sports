import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "coach", "srCoach"], required: true },
  batch: { type: String },
  profileImage: { type: String },
  email: { type: String },
});

export default mongoose.model("User", userSchema);

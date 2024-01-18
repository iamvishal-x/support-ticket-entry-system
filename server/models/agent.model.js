import mongoose from "mongoose";

const SupportAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Agent", SupportAgentSchema);

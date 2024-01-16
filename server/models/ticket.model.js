import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
      default: "Low",
    },
    type: {
      type: String,
      enum: ["Bug", "Enhancement", "Feature"],
      required: true,
      default: "Bug",
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "Agent",
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Assigned", "Resolved"],
      required: true,
      default: "New",
    },
    resolvedOn: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ticket", TicketSchema);

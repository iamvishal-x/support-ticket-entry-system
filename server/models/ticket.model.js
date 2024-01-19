const mongoose = require("mongoose");
const { TicketSeverity, TicketStatus, TicketType } = require("../constants.js");

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
      default: "",
    },
    severity: {
      type: String,
      enum: Object.values(TicketSeverity),
      required: true,
      default: TicketSeverity.low,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TicketType),
      required: true,
      default: TicketType.bug,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "Agent",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      required: true,
      default: TicketStatus.new,
      index: true,
    },
    resolvedOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);

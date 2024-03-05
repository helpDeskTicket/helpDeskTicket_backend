import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: [5, " title is too short"],
    maxLength: [100, " title is too long"],
    trim: true,
  },
  description: {
    type: String,
    minLength: [5, " description is too short"],
    maxLength: [1000, " description is too long"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["new", "pending", "resolved"],
    default: "new",
  },
  resolved: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: String,
  createdBy: String,
  resolvedAt: {
    type: String,
    default: "",
  },
});

const Ticket = mongoose.model("tickets", ticketSchema);

export default Ticket;

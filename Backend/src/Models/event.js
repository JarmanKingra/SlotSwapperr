import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
    default: "BUSY",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Event = mongoose.model("Event", EventSchema);
export default Event;

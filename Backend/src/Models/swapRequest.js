import mongoose from "mongoose";
const SwapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mySlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  theirSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const SwapRequest = mongoose.model("SwapRequest", SwapSchema);
export default SwapRequest;

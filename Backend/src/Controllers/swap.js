import Event from "../Models/event.js";
import SwapRequest from "../Models/swapRequest.js";
import mongoose from "mongoose";

const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId)
    return res.status(400).json({ message: "Missing" });
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId).session(session),
      Event.findById(theirSlotId).session(session),
    ]);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Slot not found" });
    }
    if (String(mySlot.owner) !== String(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not your slot" });
    }
    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Not swappable" });
    }

    const swap = await SwapRequest.create(
      [
        {
          requester: req.user._id,
          responder: theirSlot.owner,
          mySlot: mySlot._id,
          theirSlot: theirSlot._id,
          status: "PENDING",
        },
      ],
      { session }
    );

    await Event.updateMany(
      { _id: { $in: [mySlot._id, theirSlot._id] } },
      { $set: { status: "SWAP_PENDING" } },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(swap[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
};

const ResponseToSwapRequest = async (req, res) => {
  const { accept } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    

    const swap = await SwapRequest.findById(req.params.id).session(session);
    if (!swap) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }

    if (String(swap.responder) !== String(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: "Not authorized to respond" });
    }

    if (swap.status !== "PENDING") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Swap request is not pending anymore" });
    }

    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(swap.mySlot).session(session),
      Event.findById(swap.theirSlot).session(session)
    ]);

    if (!mySlot || !theirSlot) {
      swap.status = "REJECTED";
      await swap.save({ session });
      await session.commitTransaction();
      return res.status(404).json({ success: false, message: "One or both slots missing, auto-rejected" });
    }

    if (accept) {
      if (mySlot.status !== "SWAP_PENDING" || theirSlot.status !== "SWAP_PENDING") {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Slot status changed, cannot swap" });
      }

      const ownerA = mySlot.owner;
      const ownerB = theirSlot.owner;

      mySlot.owner = ownerB;
      mySlot.status = "BUSY";

      theirSlot.owner = ownerA;
      theirSlot.status = "BUSY";

      await mySlot.save({ session });
      await theirSlot.save({ session });

      swap.status = "ACCEPTED";
      await swap.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Swap accepted successfully ✅",
        data: {
          swapId: swap._id,
          updatedSlots: {
            mySlot: mySlot._id,
            theirSlot: theirSlot._id
          }
        }
      });
    }

    swap.status = "REJECTED";
    mySlot.status = "SWAPPABLE";
    theirSlot.status = "SWAPPABLE";

    await mySlot.save({ session });
    await theirSlot.save({ session });
    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Swap rejected ❌"
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Swap response error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export{SwapRequest, ResponseToSwapRequest};

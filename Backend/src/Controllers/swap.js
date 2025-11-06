import Event from "../Models/event.js";
import SwapRequest from "../Models/swapRequest.js";

const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId)
    return res.status(400).json({ message: "Missing" });

  try {
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId),
      Event.findById(theirSlotId),
    ]);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slot not found" });

    if (String(mySlot.owner) !== String(req.user._id))
      return res.status(403).json({ message: "Not your slot" });

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Not swappable" });

    const swap = await SwapRequest.create({
      requester: req.user._id,
      responder: theirSlot.owner,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: "PENDING",
    });

    await Event.updateMany(
      { _id: { $in: [mySlot._id, theirSlot._id] } },
      { $set: { status: "SWAP_PENDING" } }
    );

    res.status(201).json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
};


const ResponseToSwapRequest = async (req, res) => {
  const { accept } = req.body;

  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }

    if (String(swap.responder) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to respond" });
    }

    if (swap.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Swap request is not pending anymore" });
    }

    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(swap.mySlot),
      Event.findById(swap.theirSlot)
    ]);

    if (!mySlot || !theirSlot) {
      swap.status = "REJECTED";
      await swap.save();
      return res.status(404).json({ success: false, message: "One or both slots missing, auto-rejected" });
    }

    if (accept) {
      if (mySlot.status !== "SWAP_PENDING" || theirSlot.status !== "SWAP_PENDING") {
        return res.status(400).json({ success: false, message: "Slot status changed, cannot swap" });
      }

      // Swap owners
      const ownerA = mySlot.owner;
      const ownerB = theirSlot.owner;

      mySlot.owner = ownerB;
      mySlot.status = "BUSY";

      theirSlot.owner = ownerA;
      theirSlot.status = "BUSY";

      await Promise.all([
        mySlot.save(),
        theirSlot.save()
      ]);

      swap.status = "ACCEPTED";
      await swap.save();

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

    // Reject swap
    swap.status = "REJECTED";
    mySlot.status = "SWAPPABLE";
    theirSlot.status = "SWAPPABLE";

    await Promise.all([
      mySlot.save(),
      theirSlot.save(),
      swap.save()
    ]);

    return res.json({
      success: true,
      message: "Swap rejected ❌"
    });

  } catch (err) {
    console.error("Swap response error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getIncomingSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ responder: req.user._id })
      .populate("mySlot")
      .populate("theirSlot")
      .populate("requester", "name email");  

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getOutgoingSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user._id })
      .populate("mySlot")
      .populate("theirSlot")
      .populate("responder", "name email");

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export{createSwapRequest, ResponseToSwapRequest, getIncomingSwaps, getOutgoingSwaps};

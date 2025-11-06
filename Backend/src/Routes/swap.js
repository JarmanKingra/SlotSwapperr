import express from "express";
const router = express.Router();
import auth from "../Middlewares/auth.js";

import { createSwapRequest,  ResponseToSwapRequest, getIncomingSwaps, getOutgoingSwaps} from "../Controllers/swap.js";

router.route("/createSwapReq").post(auth, createSwapRequest);
router.route("/respondToReq/:id").post(auth, ResponseToSwapRequest);
router.route("/incoming").get(auth, getIncomingSwaps);
router.route("/outgoing").get(auth, getOutgoingSwaps);


export default router;
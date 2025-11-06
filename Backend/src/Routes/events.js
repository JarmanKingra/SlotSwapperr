import express from "express";
const router = express.Router();
import auth from "../Middlewares/auth.js";
import {getEvent, createEvent, updateEvent, deleteEvent, getSwappableSlots, getMySwappableSlots} from "../Controllers/events.js";


router.route("/getEvents").get(auth, getEvent);
router.route("/createEvent").post(auth, createEvent);
router.route("/:id").put(auth, updateEvent);
router.route("/:id").delete(auth, deleteEvent);
router.route("/getSwappables").get(auth, getSwappableSlots);
router.route("/getMySwappables").get(auth, getMySwappableSlots);

export default router;




import Event from "../Models/event.js";

const getEvent = async(req, res) => {
    const events = await Event.find({owner: req.user._id})
    res.json({events});
};

const createEvent = async(req, res) => {
    try {

    const {title, startTime, endTime, status} = req.body;
    const ev = await Event.create({owner: req.user._id, title, startTime, endTime, status: status || 'BUSY'});
    res.status(201).json(ev);

    } catch (error) {
        console.log("Create event Problem -- ",error);
    }
    
}

const updateEvent = async(req, res) => {

    try {
        const ev = await Event.findById(req.params.id);
    if(!ev) return res.status(404).json({message: "Not Found"});
    if(String(ev.owner) !== String(req.user._id)) return res.status(403).json({ message: "Not yours" });
    Object.assign(ev, req.body);
    await ev.save();
    res.json(ev);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error }); 
    }
    
}

const deleteEvent = async(req, res) => {
    const ev = await Event.findById(req.params.id);
    if(!ev) return res.status(404).json({message: 'Not Found'});
    if(String(ev.owner) !== String(req.user._id)) return res.status(403).json({message: 'Not yours'});
    await ev.deleteOne();
    res.json({message: 'Deleted'});
}

const getSwappableSlots = async(req, res) => {
    const slots = await Event.find({status : 'SWAPPABLE', owner: {$ne: req.user._id}}).populate('owner', 'name email');
    res.json(slots);
}

const getMySwappableSlots = async(req, res) => {
    const slots = await Event.find({status : 'SWAPPABLE', owner: req.user._id}).populate('owner', 'name email');
    res.json(slots);
}

export {getEvent, createEvent, updateEvent, deleteEvent, getSwappableSlots, getMySwappableSlots};
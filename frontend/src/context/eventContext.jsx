import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../config/index.jsx";

export const EventContext = createContext({});

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const fetchMyEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await client.get("/getEvents");
      setEvents(res.data.events || []);
    } catch (err) {
      console.log("Fetch error:", err.response?.data?.message || err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Create new event
  const createEvent = async (data) => {
    try {
      const res = await client.post("/createEvent", data);
      await fetchMyEvents();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  // Update event status
  const updateEventStatus = async (id, newStatus) => {
    try {
      const res = await client.put(`/${id}`, {
        status: newStatus,
      });
      await fetchMyEvents();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      const res = await client.delete(`/${id}`);
      await fetchMyEvents();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const fetchSwappableSlots = async () => {
  try {
    const res = await client.get("/getSwappables");
    return res.data;
  } catch (err) {
    console.log("Fetch swappables error:", err.response?.data?.message || err.message);
    return [];
  }
};


  const data = {
    events,
    loadingEvents,
    fetchMyEvents,
    createEvent,
    updateEventStatus,
    deleteEvent,
    fetchSwappableSlots
  };

  return <EventContext.Provider value={data}>{children}</EventContext.Provider>;
};
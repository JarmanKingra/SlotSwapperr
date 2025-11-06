import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../context/eventContext";

const Dashboard = () => {
  const {
    events,
    loadingEvents,
    fetchMyEvents,
    createEvent,
    updateEventStatus,
    deleteEvent
  } = useContext(EventContext);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime
    ) {
      alert("All fields are required!");
      return;
    }

    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endTime <= startTime) {
      alert("End time must be after start time!");
      return;
    }

    await createEvent({
      title: formData.title,
      startTime,
      endTime,
    });
    await fetchMyEvents();

    setFormData({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
    setShowForm(false);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const hangleDelete = async(id) => {
    await deleteEvent(id);
    fetchMyEvents();
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>My Events</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleInput}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInput}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInput}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />

          <label>End</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInput}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInput}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />

          <button type="submit" style={{ padding: "6px 12px" }}>
            Create
          </button>
        </form>
      )}

      {loadingEvents ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events yet. Create one!</p>
      ) : (
        <ul style={{ marginTop: "15px", listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            
              <li
                key={event._id}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <strong>{event.title}</strong> <br />
                {formatDateTime(event.startTime)} <br />
                to <br />
                {formatDateTime(event.endTime)} <br />
                Status: <b>{event.status}</b>
                {event.status === "BUSY" && (
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => updateEventStatus(event._id, "SWAPPABLE")}
                  >
                    Make Swappable
                  </button>
                )}
                {event.status === "SWAPPABLE" && (
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => updateEventStatus(event._id, "BUSY")}
                  >
                    Mark Busy Again
                  </button>
                )}
                <div>
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => hangleDelete(event._id)}
                  >
                   Delete
                  </button>
                </div>
              </li>
            
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

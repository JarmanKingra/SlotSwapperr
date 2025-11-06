import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../context/eventContext";
import { SwapContext } from "../../context/swapContext";
import styles from "./marketplace.module.css";

const Marketplace = () => {
  const { fetchSwappableSlots } = useContext(EventContext);
  const { fetchMySwappables, createSwapRequest } = useContext(SwapContext);

  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true);
      const data = await fetchSwappableSlots();
      setSlots(data);
      setLoading(false);
    };
    loadSlots();
  }, []);

  const loadMySwappables = async () => {
    try {
      const data = await fetchMySwappables();
      setMySlots(data);
    } catch (err) {
      alert("Error fetching your slots: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const openSwapModal = async (theirSlot) => {
    setSelectedTheirSlot(theirSlot);
    setModalOpen(true);
    setModalLoading(true);
    setMySlots([]);
    await loadMySwappables();
  };

  const handleSwapSubmit = async () => {
    if (!selectedMySlot)
      return alert("Select one of your slots to offer for swap!");
    try {
      await createSwapRequest(selectedMySlot, selectedTheirSlot._id);
      alert("Swap request sent ✅");
      setModalOpen(false);
      setSelectedMySlot("");
      setSelectedTheirSlot(null);

      setLoading(true);
      const updatedSlots = await fetchSwappableSlots();
      setSlots(updatedSlots);
      setLoading(false);
    } catch (err) {
      alert("Error sending swap request: " + err.message);
    }
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketplace – Available Swappable Slots</h2>

      {loading ? (
        <p>Loading...</p>
      ) : slots.length === 0 ? (
        <p>No swappable slots available right now.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {slots.map((event) => (
            <li key={event._id} className={styles.slotItem}>
              <strong>{event.title}</strong> <br />
              {formatDateTime(event.startTime)} →{" "}
              {formatDateTime(event.endTime)} <br />
              By: <b>{event?.owner?.name || "Unknown user"}</b> <br />
              <button
                style={{ marginTop: "8px" }}
                onClick={() => openSwapModal(event)}
              >
                Request Swap
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Choose one of your SWAPPABLE slots</h3>
            <p>
              Offering swap for: <b>{selectedTheirSlot?.title}</b>
            </p>

            {modalLoading ? (
              <p>Loading your swappable slots...</p>
            ) : (mySlots || []).length === 0 ? (
              <p>You have no SWAPPABLE slots available!</p>
            ) : (
              <ul className={styles.mySlotList}>
                {/* {(mySlots || []).length === 0 ? (
              <p>You have no SWAPPABLE slots available!</p>
            ) : (
            
              <ul className={styles.mySlotList}> */}

                {mySlots.map((event) => (
                  <li key={event._id}>
                    <label>
                      <input
                        type="radio"
                        name="mySlot"
                        value={event._id}
                        checked={selectedMySlot === event._id}
                        onChange={() => setSelectedMySlot(event._id)}
                        style={{ marginRight: "6px" }}
                      />
                      {event.title} ({formatDateTime(event.startTime)} →{" "}
                      {formatDateTime(event.endTime)})
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedMySlot("");
                  setSelectedTheirSlot(null);
                }}
              >
                Cancel
              </button>
              <button onClick={handleSwapSubmit} disabled={!selectedMySlot}>
                Send Swap Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

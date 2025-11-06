import { useEffect, useState, useContext } from "react";
import { SwapContext } from "../../context/swapContext";

const SwapRequestsPage = () => {
  const { fetchIncomingSwaps, fetchOutgoingSwaps, respondToSwap } =
    useContext(SwapContext);

  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSwaps = async () => {
    setLoading(true);
    try {
      const inData = await fetchIncomingSwaps();
      const outData = await fetchOutgoingSwaps();

      const filteredIncoming = inData.filter(swap => swap.mySlot && swap.theirSlot);
    const filteredOutgoing = outData.filter(swap => swap.mySlot && swap.theirSlot);

      setIncoming(filteredIncoming);
      setOutgoing(filteredOutgoing);
    } catch (err) {
      alert("Error loading swaps: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSwaps();
  }, []);

  const handleRespond = async (swapId, accept) => {
    try {
      await respondToSwap(swapId, accept);
      alert(`Swap ${accept ? "accepted ✅" : "rejected ❌"}`);
      loadSwaps();
    } catch (err) {
      alert("Error responding to swap: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Swap Requests</h2>

      <section>
        <h3>Sent Requests</h3>
        {outgoing.length === 0 ? (
          <p>You haven't sent any swap requests yet.</p>
        ) : (
          <ul>
            {outgoing.map((swap) => (
              <li key={swap._id}>
                To: <b>{swap.responder?.name}</b> | My Slot:{" "}
                {swap.mySlot ? swap.mySlot.title : "Deleted"} | Their Slot:{" "}
                {swap.theirSlot ? swap.theirSlot.title : "Deleted"} | Status:{" "}
                {swap.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "30px" }}>
        <h3>Received Requests</h3>
        {incoming.length === 0 ? (
          <p>No one has sent you swap requests yet.</p>
        ) : (
          <ul>
            {incoming.map((swap) => (
              <li key={swap._id}>
                From: <b>{swap.requester?.name}</b> | Their Slot:{" "}
                {swap.theirSlot ? swap.theirSlot.title : "Deleted"} | My Slot:{" "}
                {swap.mySlot ? swap.mySlot.title : "Deleted"} | Status:{" "}
                {swap.status}
                {swap.status === "PENDING" && swap.mySlot && swap.theirSlot && (
                  <div style={{ marginTop: "5px" }}>
                    <button
                      onClick={() => handleRespond(swap._id, true)}
                      style={{ marginRight: "5px" }}
                    >
                      Accept ✅
                    </button>
                    <button onClick={() => handleRespond(swap._id, false)}>
                      Reject ❌
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SwapRequestsPage;

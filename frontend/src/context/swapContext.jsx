import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../config/index.jsx";

export const SwapContext = createContext({});

export const SwapProvider = ({ children }) => {
  const fetchMySwappables = async () => {
    try {
      const res = await client.get("/getMySwappables");
      return res.data || [];
    } catch (err) {
      console.error("Fetch swappables error:", err);
      return [];
    }
  };

  const createSwapRequest = async (mySlotId, theirSlotId) => {
    try {
      const res = await client.post("/createSwapReq", {
        mySlotId,
        theirSlotId,
      });
      return res.data;
    } catch (err) {
      console.error("Swap request error:", err);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const fetchIncomingSwaps = async () => {
    try {
      const res = await client.get("/incoming");
      return res.data || [];
    } catch (err) {
      console.error("Fetch incoming swaps error:", err);
      return [];
    }
  };

  const fetchOutgoingSwaps = async () => {
    try {
      const res = await client.get("/outgoing");
      return res.data || [];
    } catch (err) {
      console.error("Fetch outgoing swaps error:", err);
      return [];
    }
  };

  const respondToSwap = async (swapId, accept) => {
  try {
    const res = await client.post(`/respondToReq/${swapId}`, { accept});
    return res.data;
  } catch (err) {
    console.error("Respond swap error:", err);
    throw new Error(err.response?.data?.message || err.message);
  }
};

  const data = {
    fetchMySwappables,
    createSwapRequest,
    fetchIncomingSwaps,
    fetchOutgoingSwaps,
    respondToSwap
  };

  return <SwapContext.Provider value={data}>{children}</SwapContext.Provider>;
};

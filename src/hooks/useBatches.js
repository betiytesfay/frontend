import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/config";

export default function useBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/batches`)
      .then((res) => setBatches(res.data.data.batches || []))
      .catch((err) => console.error("useBatches error", err))
      .finally(() => setLoading(false));
  }, []);

  return { batches, loading };
}

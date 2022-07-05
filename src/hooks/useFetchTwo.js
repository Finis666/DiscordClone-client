import axios from "axios";
import React, { useEffect, useState } from "react";

export default function useFetchTwo(firstUrl, secUrl) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    let req_1 = axios.get(firstUrl, {
      signal: controller.signal,
      headers: { "x-auth-token": localStorage.getItem("token") },
    });
    let req_2 = axios.get(secUrl, {
      signal: controller.signal,
      headers: { "x-auth-token": localStorage.getItem("token") },
    });
    axios
      .all([req_1, req_2])
      .then(
        axios.spread((...allData) => {
          setData([allData[0], allData[1]]);
          setLoading(false);
        })
      )
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [firstUrl, secUrl]);
  return { data, loading };
}

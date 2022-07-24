import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

export default function useFetchTwo(firstUrl, secUrl, thirdUrl) {
  const isMount = useRef(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!isMount.current) {
      const controller = new AbortController();
      let req_1 = axios.get(firstUrl, {
        signal: controller.signal,
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      let req_2 = axios.get(secUrl, {
        signal: controller.signal,
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      let req_3 = axios.get(thirdUrl, {
        signal: controller.signal,
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      axios
        .all([req_1, req_2, req_3])
        .then(
          axios.spread((...allData) => {
            setData([allData[0], allData[1], allData[2]]);
            setLoading(false);
          })
        )
        .catch((err) => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
      return () => {
        isMount.current = true;
      };
    }
  }, [firstUrl, secUrl, thirdUrl]);
  return { data, loading };
}

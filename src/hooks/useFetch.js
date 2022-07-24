import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function useFetch(url) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      const controller = new AbortController();
      axios
        .get(url, {
          signal: controller.signal,
          headers: { "x-auth-token": localStorage.getItem("token") },
        })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          controller.abort();
          return err;
        })
        .finally(() => {
          setLoading(false);
        });
      return () => {
        isMount.current = true;
      };
    }
  }, [url]);
  return { data, loading };
}

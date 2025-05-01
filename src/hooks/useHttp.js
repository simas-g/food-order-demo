import { useEffect, useState, useCallback } from "react";

async function sendHttpRequest(url, config) {
  const res = await fetch(url, config);
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message || "Error occurred");
  }
  return resData;
}
export default function useHttp(url, config, initialData) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);
  function clearData() {
    setData(initialData)
  }
  const sendRequest = useCallback(
    async function sendRequest(data) {
      setLoading(true);
      try {
        const resData = await sendHttpRequest(url, {...config, body: data});
        setData(resData);
      } catch (error) {
        setError(error.message || "Something went wrong");
      }
      setLoading(false);
    },
    [url, config]
  );
  useEffect(() => {
    if (config && config.method === "GET") {
      sendRequest();
    }
  }, [sendRequest, config]);
  return {
    data,
    loading,
    error,
    sendRequest,
    clearData
  };
}

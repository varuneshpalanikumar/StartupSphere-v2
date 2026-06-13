import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MyJoinRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchMyRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await API.get(`/join-requests/professional/${user._id}`);
      setRequests(res.data.data || res.data);
      setIsError(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Failed to fetch your join requests");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "alert-success";
    if (status === "rejected") return "alert-error";
    return "";
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">My Join Requests</h1>
        <p className="page-subtitle">
          Track the status of join requests you have sent to startups.
        </p>

        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}

        {requests.length === 0 ? (
          <p className="muted">You have not sent any join requests yet.</p>
        ) : (
          <div className="grid grid-2">
            {requests.map((request) => (
              <div className="card clickable-card" key={request._id}>
                <h3>{request.startup?.title}</h3>

                <p className="muted" style={{ marginTop: "8px" }}>
                  {request.startup?.description}
                </p>

                <p style={{ marginTop: "12px" }}>
                  <strong>Progress:</strong> {request.startup?.progress || 0}%
                </p>

                <p style={{ marginTop: "12px" }}>
                  <strong>Message Sent:</strong> {request.message || "No message"}
                </p>

                <div style={{ marginTop: "14px" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    className={request.status !== "pending" ? getStatusClass(request.status) : ""}
                    style={
                      request.status === "pending"
                        ? {
                            padding: "6px 10px",
                            borderRadius: "10px",
                            background: "rgba(245, 158, 11, 0.12)",
                            color: "#fcd34d",
                            border: "1px solid rgba(245, 158, 11, 0.25)",
                            fontWeight: "700"
                          }
                        : {
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "10px",
                            fontWeight: "700"
                          }
                    }
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyJoinRequests;
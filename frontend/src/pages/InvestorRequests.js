import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function InvestorRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/investor-requests/investor/${user._id}`);
      setRequests(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Failed to fetch funding requests");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const res = await API.put(`/investor-requests/accept/${requestId}`);

      setIsError(false);
      setMessage(res.data.message || "Funding request accepted successfully");

      fetchRequests();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to accept funding request"
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const res = await API.put(`/investor-requests/reject/${requestId}`);

      setIsError(false);
      setMessage(res.data.message || "Funding request rejected successfully");

      fetchRequests();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to reject funding request"
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Funding Requests</h1>
        <p className="page-subtitle">
          Review funding requests sent by founders.
        </p>

        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}

        {requests.length === 0 ? (
          <p className="muted">No pending funding requests.</p>
        ) : (
          <div className="grid grid-2">
            {requests.map((request) => (
              <div className="card clickable-card" key={request._id}>
                <h3>{request.startup?.title}</h3>

                <p className="muted" style={{ marginBottom: "10px" }}>
                  Founder: {request.founder?.name}
                </p>

                <p>
                  <strong>Startup Score:</strong> {request.startup?.startupScore || 0}
                </p>

                <p>
                  <strong>Progress:</strong> {request.startup?.progress || 0}%
                </p>

                <p>
                  <strong>Funding Required:</strong> ₹{request.startup?.fundingRequired || 0}
                </p>

                <p style={{ margin: "10px 0" }}>
                  <strong>Message:</strong> {request.message || "No message"}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => acceptRequest(request._id)}
                  style={{ marginRight: "10px" }}
                >
                  Accept
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => rejectRequest(request._id)}
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default InvestorRequests;
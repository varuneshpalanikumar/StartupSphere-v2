import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function FounderInvestorRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/investor-requests/founder/${user._id}`);
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

  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await API.put(`/investor-requests/${action}/${requestId}`);

      setIsError(false);
      setMessage(
        res.data.message ||
          (action === "accept"
            ? "Funding request accepted successfully"
            : "Funding request rejected successfully")
      );

      fetchRequests();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to update funding request"
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
        <h1 className="page-title">Your Funding Requests</h1>
        <p className="page-subtitle">
          Track founder requests and investor interest for your startups.
        </p>

        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}

        {requests.length === 0 ? (
          <p className="muted">No funding requests yet.</p>
        ) : (
          <div className="grid grid-2">
            {requests.map((request) => (
              <div className="card clickable-card" key={request._id}>
                <h3>{request.startup?.title}</h3>

                <p>
                  <strong>Investor:</strong> {request.investor?.name}
                </p>

                <p>
                  <strong>Status:</strong> {request.status}
                </p>

                <p>
                  <strong>Initiated By:</strong> {request.initiatedBy}
                </p>

                <p style={{ marginTop: "10px" }}>
                  <strong>Message:</strong> {request.message || "No message"}
                </p>

                {request.status === "pending" && request.initiatedBy === "investor" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "16px",
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRequestAction(request._id, "accept")}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRequestAction(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status === "pending" && request.initiatedBy === "founder" && (
                  <p className="muted" style={{ marginTop: "14px" }}>
                    Waiting for investor response.
                  </p>
                )}

                {request.status === "accepted" && (
                  <p className="muted" style={{ marginTop: "14px" }}>
                    Investor has been added to the startup.
                  </p>
                )}

                {request.status === "rejected" && (
                  <p className="muted" style={{ marginTop: "14px" }}>
                    This funding request was rejected.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FounderInvestorRequests;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MentorRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/mentor-requests/mentor/${user._id}`);
      setRequests(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const res = await API.put(`/mentor-requests/accept/${requestId}`);

      if (res.data.requestType === "review") {
        navigate(`/startup/${res.data.startupId}`);
        return;
      }

      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await API.put(`/mentor-requests/reject/${requestId}`);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Mentor Requests</h1>
        <p className="page-subtitle">
          Review pending review and mentorship requests.
        </p>

        {requests.length === 0 ? (
          <p className="muted">No pending mentor requests.</p>
        ) : (
          <div className="grid grid-2">
            {requests.map((request) => (
              <div className="card clickable-card" key={request._id}>
                <h3>{request.startup?.title}</h3>
                <p className="muted" style={{ marginBottom: "10px" }}>
                  Founder: {request.founder?.name}
                </p>

                <p>
                  <strong>Type:</strong> {request.requestType}
                </p>

                <p>
                  <strong>Progress:</strong> {request.startup?.progress}%
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

export default MentorRequests;
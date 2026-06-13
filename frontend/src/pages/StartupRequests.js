import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import JoinRequestCard from "../components/JoinRequestCard";

function StartupRequests() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/join-requests/startup/${id}`);
      setRequests(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Join Requests</h1>
        <p className="page-subtitle">
          Review professional requests for this startup.
        </p>

        {requests.length === 0 ? (
          <p className="muted">No join requests yet.</p>
        ) : (
          <div className="grid grid-3">
            {requests.map((request) => (
              <JoinRequestCard
                key={request._id}
                request={request}
                refresh={fetchRequests}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StartupRequests;
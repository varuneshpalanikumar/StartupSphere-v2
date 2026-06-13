import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MentorStartups() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [startups, setStartups] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchMentorStartups();
    }
  }, []);

  const fetchMentorStartups = async () => {
    try {
      const res = await API.get(`/startups/mentor/${user._id}`);
      setStartups(res.data.data || res.data);
      setIsError(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Failed to fetch mentored startups");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">My Mentoring Startups</h1>
        <p className="page-subtitle">
          Startups where you are currently added as a mentor.
        </p>

        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}

        {startups.length === 0 ? (
          <p className="muted">You are not mentoring any startups yet.</p>
        ) : (
          <div className="grid grid-2">
            {startups.map((startup) => (
              <div className="card clickable-card" key={startup._id}>
                <h3>{startup.title}</h3>

                <p className="muted" style={{ marginTop: "8px" }}>
                  {startup.description}
                </p>

                <p style={{ marginTop: "12px" }}>
                  <strong>Founder:</strong> {startup.founder?.name}
                </p>

                <p>
                  <strong>Progress:</strong> {startup.progress || 0}%
                </p>

                <p>
                  <strong>Score:</strong> {startup.startupScore || 0}
                </p>
                <div style={{ marginTop: "16px" }}>
                
                  <Link to={`/startup/${startup._id}`}>
                    <button className="btn btn-primary">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MentorStartups;
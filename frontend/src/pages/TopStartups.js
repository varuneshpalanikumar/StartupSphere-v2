import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function TopStartups() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetchTopStartups();
  }, []);

  const fetchTopStartups = async () => {
    try {
      const res = await API.get("/startups/all");

      const sortedStartups = [...(res.data.data || res.data)].sort(
        (a, b) => b.startupScore - a.startupScore
      );

      setStartups(sortedStartups);
    } catch (error) {
      console.error(error);
    }
  };

  const getRankLabel = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Top Startups</h1>
        <p className="page-subtitle">
          Ranked by startup score to help investors discover promising ventures.
        </p>

        {startups.length === 0 ? (
          <p className="muted">No startups available yet.</p>
        ) : (
          <div className="grid grid-2">
            {startups.map((startup, index) => (
              <div className="card clickable-card" key={startup._id}>
                <p
                  style={{
                    color: "#2563eb",
                    fontWeight: "700",
                    marginBottom: "10px"
                  }}
                >
                  {getRankLabel(index)}
                </p>

                <h3>{startup.title}</h3>

                <p className="muted" style={{ margin: "10px 0 14px" }}>
                  {startup.description}
                </p>

                <p>
                  <strong>Founder:</strong> {startup.founder?.name || "Unknown"}
                </p>

                <p>
                  <strong>Startup Score:</strong> {startup.startupScore}
                </p>

                <p>
                  <strong>Progress:</strong> {startup.progress}%
                </p>

                <p>
                  <strong>Funding Required:</strong> ${startup.fundingRequired}
                </p>

                <div style={{ marginTop: "16px" }}>
                  <Link to={`/startup/${startup._id}`}>
                    <button className="btn btn-primary">
                      View Portfolio
                    </button>
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

export default TopStartups;
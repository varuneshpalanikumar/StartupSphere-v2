import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Link } from "react-router-dom";

function InvestorStartups() {

  const user = JSON.parse(sessionStorage.getItem("user"));
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetchInvestorStartups();
  }, []);

  const fetchInvestorStartups = async () => {
    try {

      const res = await API.get(`/startups/investor/${user._id}`);
      setStartups(res.data.data || res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">My Investments</h1>
        <p className="page-subtitle">
          Startups you are interested in funding.
        </p>

        {startups.length === 0 ? (
          <p className="muted">No startups yet.</p>
        ) : (
          <div className="grid grid-2">

            {startups.map((startup) => (
              <div className="card clickable-card" key={startup._id}>

                <h3>{startup.title}</h3>

                <p className="muted">
                  {startup.description}
                </p>

                <p>
                  <strong>Founder:</strong> {startup.founder?.name}
                </p>

                <p>
                  <strong>Progress:</strong> {startup.progress || 0}%
                </p>

                <p>
                  <strong>Score:</strong> {startup.startupScore || 0}
                </p>
<br></br>
                <Link to={`/startup/${startup._id}`}>
                  <button className="btn btn-primary">
                    View Details
                  </button>
                </Link>

              </div>
            ))}

          </div>
        )}
      </div>
    </>
  );
}

export default InvestorStartups;
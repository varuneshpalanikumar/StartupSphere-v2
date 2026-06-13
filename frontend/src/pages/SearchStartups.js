import { useState, useEffect } from "react";
import API from "../services/api";
import StartupCard from "../components/StartupCard";
import Navbar from "../components/Navbar";

function SearchStartups() {
  const [startups, setStartups] = useState([]);

  const [filters, setFilters] = useState({
    techSupportRequired: "",
    mentorshipRequired: "",
    mentorReviewRequested: "",
    minScore: "",
    minProgress: "",
    title: ""
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const searchStartups = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.techSupportRequired !== "") {
        params.append("techSupportRequired", filters.techSupportRequired);
      }

      if (filters.mentorshipRequired !== "") {
        params.append("mentorshipRequired", filters.mentorshipRequired);
      }

      if (filters.mentorReviewRequested !== "") {
        params.append("mentorReviewRequested", filters.mentorReviewRequested);
      }

      if (filters.minScore) {
        params.append("minScore", filters.minScore);
      }

      if (filters.minProgress) {
        params.append("minProgress", filters.minProgress);
      }

      if (filters.title) {
        params.append("title", filters.title);
      }

      const res = await API.get(`/startups/search?${params.toString()}`);
      setStartups(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    searchStartups();
  }, []);

  return (
    <>
  <Navbar />
    <div className="page-container">
      <h1 className="page-title">Explore Startups</h1>
      <p className="page-subtitle">
        Discover startups based on support needs, score, and progress.
      </p>

      <div className="card clickable-card" style={{ marginBottom: "20px" }}>
        <div className="grid grid-3">
          <div className="input-group">
            <label>Title</label>
            <input
              name="title"
              value={filters.title}
              onChange={handleChange}
              placeholder="AI, health..."
            />
          </div>

          <div className="input-group">
            <label>Tech Support Required</label>
            <select
              name="techSupportRequired"
              value={filters.techSupportRequired}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="input-group">
            <label>Mentorship Required</label>
            <select
              name="mentorshipRequired"
              value={filters.mentorshipRequired}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="input-group">
            <label>Mentor Review Requested</label>
            <select
              name="mentorReviewRequested"
              value={filters.mentorReviewRequested}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="input-group">
            <label>Minimum Score</label>
            <input
              type="number"
              name="minScore"
              value={filters.minScore}
              onChange={handleChange}
              placeholder="50"
            />
          </div>

          <div className="input-group">
            <label>Minimum Progress</label>
            <input
              type="number"
              name="minProgress"
              value={filters.minProgress}
              onChange={handleChange}
              placeholder="30"
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={searchStartups}>
          Search Startups
        </button>
      </div>

      <div className="grid grid-3">
        {startups.map((startup) => (
          <StartupCard key={startup._id} startup={startup} />
        ))}
      </div>
    </div>
    </>
  );
}

export default SearchStartups;
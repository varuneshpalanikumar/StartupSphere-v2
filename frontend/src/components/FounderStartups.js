import { useEffect, useState } from "react";
import API from "../services/api";
import StartupCard from "./StartupCard";

function FounderStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/startups/founder/${user._id}`);
      const startupsData = res.data.data || res.data;

      const startupsWithEvals = await Promise.all(startupsData.map(async (startup) => {
        try {
          const evalRes = await API.get(`/ai/evaluation/${startup._id}`);
          return { ...startup, aiEvaluation: evalRes.data.data };
        } catch (e) {
          return { ...startup, aiEvaluation: null };
        }
      }));

      setStartups(startupsWithEvals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container" style={{ padding: '40px 0', textAlign: 'center' }}>Loading startups and analytics...</div>;
  }

  if (startups.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa' }}>
        <h3>No Startups Found</h3>
        <p className="muted" style={{ marginTop: '10px' }}>
          You have not created any startups yet. Go to the dashboard to create one.
        </p>
      </div>
    );
  }

  const totalStartups = startups.length;
  const analyzedStartups = startups.filter(s => s.aiEvaluation).length;
  const averageAiScore = analyzedStartups > 0 ? 
    Math.round(startups.reduce((acc, s) => acc + (s.aiEvaluation?.aiScore || 0), 0) / analyzedStartups) : 0;
  const highestAiScore = analyzedStartups > 0 ? 
    Math.round(Math.max(...startups.map(s => s.aiEvaluation?.aiScore || 0))) : 0;

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: "24px" }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 style={{ color: '#666', marginBottom: '10px' }}>Total Startups</h4>
          <h2 style={{ fontSize: '2rem', color: '#333' }}>{totalStartups}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 style={{ color: '#666', marginBottom: '10px' }}>AI Analyzed</h4>
          <h2 style={{ fontSize: '2rem', color: '#007bff' }}>{analyzedStartups}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 style={{ color: '#666', marginBottom: '10px' }}>Average AI Score</h4>
          <h2 style={{ fontSize: '2rem', color: averageAiScore >= 80 ? '#28a745' : averageAiScore >= 60 ? '#ffc107' : '#dc3545' }}>{averageAiScore}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 style={{ color: '#666', marginBottom: '10px' }}>Highest AI Score</h4>
          <h2 style={{ fontSize: '2rem', color: highestAiScore >= 80 ? '#28a745' : highestAiScore >= 60 ? '#ffc107' : '#dc3545' }}>{highestAiScore}</h2>
        </div>
      </div>

      <div className="grid grid-3">
        {startups.map((startup) => (
          <StartupCard key={startup._id} startup={startup} />
        ))}
      </div>
    </div>
  );
}

export default FounderStartups;
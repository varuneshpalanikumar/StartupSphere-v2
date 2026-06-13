import { Link } from "react-router-dom";

function StartupCard({ startup }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isFounder = user && startup.founder && user._id === startup.founder._id;

  return (
    <div className="card clickable-card">
      <h3>{startup.title}</h3>

      <p className="muted" style={{ margin: "8px 0 12px" }}>
        {startup.description}
      </p>

      <p>
        <strong>Founder:</strong> {startup.founder?.name || "Unknown"}
      </p>

      <p>
        <strong>Progress:</strong> {startup.progress}%
      </p>

      <p>
        <strong>Startup Score:</strong> {startup.startupScore}
      </p>

      <p>
        <strong>Funding Required:</strong> {startup.fundingRequired}
      </p>

      {isFounder && startup.aiEvaluation !== undefined && (
        <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          {startup.aiEvaluation ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>AI Score:</strong>
                <span style={{ background: '#007bff', color: 'white', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  {Math.round(startup.aiEvaluation.aiScore)}/100
                </span>
              </div>
              <p style={{ marginBottom: '4px' }}><strong>Funding Readiness:</strong> {startup.aiEvaluation.fundingReadiness}</p>
              <p style={{ marginBottom: '12px' }}><strong>Investment Verdict:</strong> {startup.aiEvaluation.investmentVerdict}</p>
              <Link to={`/startup/${startup._id}/advisor`}>
                <button className="btn btn-secondary" style={{ width: '100%' }}>View AI Analysis</button>
              </Link>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '12px', color: '#666' }}><strong>AI Analysis:</strong> Not yet generated</p>
              <Link to={`/startup/${startup._id}/advisor`}>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Get AI Analysis</button>
              </Link>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: "16px" }}>
        <Link to={`/startup/${startup._id}`}>
          <button className="btn btn-primary">View Portfolio</button>
        </Link>
      </div>
    </div>
  );
}

export default StartupCard;
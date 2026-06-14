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
        <strong>Funding Required:</strong> {startup.fundingRequired}
      </p>

      {isFounder && startup.aiEvaluation !== undefined && (
        <div style={{ marginTop: '16px', padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          {startup.aiEvaluation ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--text)' }}>AI Score:</strong>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  {Math.round(startup.aiEvaluation.aiScore)}/100
                </span>
              </div>
              <p style={{ marginBottom: '4px', color: 'var(--text)' }}><strong style={{ color: 'var(--text)' }}>Funding Readiness:</strong> {startup.aiEvaluation.fundingReadiness}</p>
              <p style={{ marginBottom: '12px', color: 'var(--text)' }}><strong style={{ color: 'var(--text)' }}>Investment Verdict:</strong> {startup.aiEvaluation.investmentVerdict}</p>
              <Link to={`/startup/${startup._id}/advisor`}>
                <button className="btn btn-secondary" style={{ width: '100%' }}>View AI Analysis</button>
              </Link>
            </>
          ) : (
            <>
              <p className="muted" style={{ marginBottom: '12px' }}><strong>AI Analysis:</strong> Not yet generated</p>
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
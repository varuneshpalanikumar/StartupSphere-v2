function UserCard({
  user,
  onClick,
  showMentorActions = false,
  showInvestorActions = false,
  founderStartups = [],
  selectedStartupId = "",
  onStartupChange,
  onSendReviewRequest,
  onSendMentorshipRequest,
  onSendFundingRequest
}) {
  return (
    <div
      className="card clickable-card"
      style={{ cursor: "pointer" }}
      onClick={() => onClick && onClick(user)}
    >
      <h3>
        {user.name}

        {user.verified && (
          <span className="verified-badge">
            ✔ Verified
          </span>
        )}
      </h3>

      <p className="muted">
        {user.role}
      </p>

      {user.skills && user.skills.length > 0 && (
        <p>
          <strong>Skills:</strong> {user.skills.join(", ")}
        </p>
      )}

      {user.portfolio && (
        <p>
          <strong>Portfolio:</strong>{" "}
          <a
            href={
              user.portfolio.startsWith("http") ? user.portfolio : `https://${user.portfolio}`
            }
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        </p>
      )}

      {(showMentorActions || showInvestorActions) && (
        <div
          style={{ marginTop: "16px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="input-group">
            <label>Select Startup</label>
            <select
              value={selectedStartupId}
              onChange={(e) => onStartupChange(e.target.value)}
            >
              <option value="">Choose startup</option>
              {founderStartups.map((startup) => (
                <option key={startup._id} value={startup._id}>
                  {startup.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showMentorActions && user.role === "mentor" && (
        <div
          style={{ marginTop: "10px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-primary"
            style={{ marginRight: "10px" }}
            onClick={() => onSendReviewRequest(user._id)}
          >
            Request Review
          </button>
          <div><br></br></div>
          <button
            className="btn btn-secondary"
            onClick={() => onSendMentorshipRequest(user._id)}
          >
            Request Mentorship
          </button>
        </div>
      )}

      {showInvestorActions && user.role === "investor" && (
        <div
          style={{ marginTop: "10px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-primary"
            onClick={() => onSendFundingRequest(user._id)}
          >
            Request Funding
          </button>
        </div>
      )}
    </div>
  );
}

export default UserCard;
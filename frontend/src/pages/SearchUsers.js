import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import UserCard from "../components/UserCard";
import UserInfoModal from "../components/UserInfoModal";

function SearchUsers() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role") || "";

  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [founderStartups, setFounderStartups] = useState([]);
  const [selectedStartupByUser, setSelectedStartupByUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [filters, setFilters] = useState({
    role: roleFromUrl,
    skill: "",
    name: ""
  });

  const showMessage = (text, error = false) => {
    setIsError(error);
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleStartupChange = (userId, startupId) => {
    setSelectedStartupByUser((prev) => ({
      ...prev,
      [userId]: startupId
    }));
  };

  const searchUsers = async (customFilters = filters) => {
    try {
      const params = new URLSearchParams();

      if (customFilters.role) params.append("role", customFilters.role);
      if (customFilters.skill) params.append("skill", customFilters.skill);
      if (customFilters.name) params.append("name", customFilters.name);

      const res = await API.get(`/users/search?${params.toString()}`);
      setUsers(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      showMessage("Failed to search users", true);
    }
  };

  const fetchFounderStartups = async () => {
    if (!loggedInUser || loggedInUser.role !== "founder") return;

    try {
      const res = await API.get(`/startups/founder/${loggedInUser._id}`);
      setFounderStartups(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      showMessage("Failed to fetch your startups", true);
    }
  };

  useEffect(() => {
    const initialFilters = {
      role: roleFromUrl,
      skill: "",
      name: ""
    };

    setFilters(initialFilters);
    searchUsers(initialFilters);
    fetchFounderStartups();
  }, [roleFromUrl]);

  const getTitle = () => {
    if (filters.role === "mentor") return "Search Mentors";
    if (filters.role === "professional") return "Search Professionals";
    if (filters.role === "investor") return "Search Investors";
    return "Search Users";
  };

  const sendMentorRequest = async (mentorId, requestType) => {
    if (!loggedInUser || loggedInUser.role !== "founder") {
      showMessage("Only founders can send mentor requests", true);
      return;
    }

    const selectedStartupId = selectedStartupByUser[mentorId];

    if (!selectedStartupId) {
      showMessage("Please select one of your startups first", true);
      return;
    }

    try {
      await API.post("/mentor-requests", {
        startupId: selectedStartupId,
        founderId: loggedInUser._id,
        mentorId,
        requestType,
        message:
          requestType === "review"
            ? "We would like your review on this startup."
            : "We would like mentorship support for this startup."
      });

      showMessage(
        requestType === "review"
          ? "Review request sent successfully"
          : "Mentorship request sent successfully"
      );
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send mentor request",
        true
      );
    }
  };

  const sendFundingRequest = async (investorId) => {
    if (!loggedInUser || loggedInUser.role !== "founder") {
      showMessage("Only founders can send funding requests", true);
      return;
    }

    const selectedStartupId = selectedStartupByUser[investorId];

    if (!selectedStartupId) {
      showMessage("Please select one of your startups first", true);
      return;
    }

    try {
      await API.post("/investor-requests", {
        startupId: selectedStartupId,
        founderId: loggedInUser._id,
        investorId,
        message: "We would like to request funding support for this startup."
      });

      showMessage("Funding request sent successfully");
    } catch (error) {
      console.error(error);
      showMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send funding request",
        true
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">{getTitle()}</h1>
<br></br>
        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}
<br></br>
        <div className="card clickable-card" style={{ marginBottom: "20px" }}>
          <div className="grid grid-3">
            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleChange}
              >
                <option value="">Any</option>
                <option value="mentor">Mentor</option>
                <option value="professional">Professional</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            <div className="input-group">
              <label>Skill</label>
              <input
                name="skill"
                value={filters.skill}
                onChange={handleChange}
                placeholder="React"
              />
            </div>

            <div className="input-group">
              <label>Name</label>
              <input
                name="name"
                value={filters.name}
                onChange={handleChange}
                placeholder="Search name"
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => searchUsers()}
          >
            Search
          </button>
        </div>

        <p className="muted" style={{ marginBottom: "14px" }}>
          Click any user card to view full details.
        </p>

        <div className="grid grid-3">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onClick={setSelectedUser}
              showMentorActions={
                loggedInUser?.role === "founder" && user.role === "mentor"
              }
              showInvestorActions={
                loggedInUser?.role === "founder" && user.role === "investor"
              }
              founderStartups={founderStartups}
              selectedStartupId={selectedStartupByUser[user._id] || ""}
              onStartupChange={(startupId) =>
                handleStartupChange(user._id, startupId)
              }
              onSendReviewRequest={() => sendMentorRequest(user._id, "review")}
              onSendMentorshipRequest={() =>
                sendMentorRequest(user._id, "mentorship")
              }
              onSendFundingRequest={() => sendFundingRequest(user._id)}
            />
          ))}
        </div>
      </div>

      <UserInfoModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}

export default SearchUsers;
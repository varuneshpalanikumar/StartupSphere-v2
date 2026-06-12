import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { showToast } from "../components/Toast";
import Navbar from "../components/Navbar";

function CreateStartup() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    fundingRequired: "",
    techSupportRequired: false,
    mentorshipRequired: false,
    mentorReviewRequested: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "founder") {
      showToast("Only founders can create startups", "error");
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        founder: user._id,
        fundingRequired: Number(form.fundingRequired) || 0,
        techSupportRequired: form.techSupportRequired,
        mentorshipRequired: form.mentorshipRequired,
        mentorReviewRequested: form.mentorReviewRequested
      };

      const res = await API.post("/startups/create", payload);

      showToast(res.data.message || "Startup created successfully", "success");
      const startupId = res.data.startup._id;

      setTimeout(() => {
        navigate(`/startup/${startupId}`);
      }, 1000);

    } catch (error) {
      const message = error.response?.data?.message || "Failed to create startup";
      showToast(message, "error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <div className="card clickable-card" style={{ maxWidth: "700px", margin: "20px auto" }}>
          <h1 className="page-title">Create Startup</h1>
          <p className="page-subtitle">
            Publish your startup idea and request the support you need.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Startup Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="AI Medical Assistant"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your startup idea, problem, and solution..."
                required
              />
            </div>

            <div className="input-group">
              <label>Funding Required</label>
              <input
                type="number"
                name="fundingRequired"
                value={form.fundingRequired}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>

            <div className="checkbox-row">
  <input
    type="checkbox"
    name="techSupportRequired"
    checked={form.techSupportRequired}
    onChange={handleChange}
  />
  <label>Technical Support Required</label>
</div>

<div className="checkbox-row">
  <input
    type="checkbox"
    name="mentorshipRequired"
    checked={form.mentorshipRequired}
    onChange={handleChange}
  />
  <label>Mentorship Required</label>
</div>

<div className="checkbox-row">
  <input
    type="checkbox"
    name="mentorReviewRequested"
    checked={form.mentorReviewRequested}
    onChange={handleChange}
  />
  <label>Request Mentor Review</label>
</div>

            <button className="btn btn-primary" type="submit">
              Create Startup
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateStartup;
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import StartupCard from "../components/StartupCard";

function ProfessionalProjects() {

  const [projects, setProjects] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const res = await API.get(`/users/${user._id}/joined-projects`);

      setProjects(res.data.data || res.data);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <>
      <Navbar />

      <div className="page-container">

        <h1 className="page-title">
          Joined Startups
        </h1>

        {projects.length === 0 ? (
          <p className="muted">
            You haven't joined any startups yet.
          </p>
        ) : (
          <div className="grid grid-3">
            {projects.map((startup) => (
              <StartupCard key={startup._id} startup={startup} />
            ))}
          </div>
        )}

      </div>
    </>
  );

}

export default ProfessionalProjects;
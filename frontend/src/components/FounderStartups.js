import { useEffect, useState } from "react";
import API from "../services/api";
import StartupCard from "./StartupCard";

function FounderStartups() {

  const [startups, setStartups] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    fetchStartups();
  }, []);

  const fetchStartups = async () => {

    try {

      const res = await API.get(`/startups/founder/${user._id}`);

      setStartups(res.data.data || res.data);

    } catch (error) {

      console.error(error);

    }

  };

  if (startups.length === 0) {
    return (
      <p className="muted">
        You have not created any startups yet.
      </p>
    );
  }

  return (

    <div className="grid grid-3">

      {startups.map((startup) => (
        <StartupCard key={startup._id} startup={startup} />
      ))}

    </div>

  );
}

export default FounderStartups;
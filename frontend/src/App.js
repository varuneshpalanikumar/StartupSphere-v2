import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateStartup from "./pages/CreateStartup";
import StartupPortfolio from "./pages/StartupPortfolio";
import SearchUsers from "./pages/SearchUsers";
import SearchStartups from "./pages/SearchStartups";
import StartupRequests from "./pages/StartupRequests";
import ProfessionalProjects from "./pages/ProfessionalProjects";
import VoteRequests from "./pages/VoteRequests";
import TopStartups from "./pages/TopStartups";
import MentorRequests from "./pages/MentorRequests";
import FounderMentorRequests from "./pages/FounderMentorRequests";
import InvestorRequests from "./pages/InvestorRequests";
import FounderInvestorRequests from "./pages/FounderInvestorRequests";
import MentorStartups from "./pages/MentorStartups";
import InvestorStartups from "./pages/InvestorStartups";
import MyJoinRequests from "./pages/MyJoinRequests";
import Toast from "./components/Toast";
import "./styles/main.css";



function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-startup" element={<CreateStartup />} />
        <Route path="/startup/:id" element={<StartupPortfolio />} />
        <Route path="/search-users" element={<SearchUsers />} />
        <Route path="/search-startups" element={<SearchStartups />} />
        <Route path="/startup/:id/requests" element={<StartupRequests />} />
        <Route path="/professional-projects" element={<ProfessionalProjects />} />
        <Route path="/vote-requests" element={<VoteRequests />} />
        <Route path="/top-startups" element={<TopStartups />} />
        <Route path="/mentor-requests" element={<MentorRequests />} />
        <Route path="/founder-mentor-requests" element={<FounderMentorRequests />} />
        <Route path="/investor-requests" element={<InvestorRequests />} />
        <Route path="/founder-investor-requests" element={<FounderInvestorRequests />} />
        <Route path="/mentor-startups" element={<MentorStartups />} />
        <Route path="/investor-startups" element={<InvestorStartups />} />
        <Route path="/my-join-requests" element={<MyJoinRequests />} />
      </Routes>
    </Router>
  );
}

export default App;
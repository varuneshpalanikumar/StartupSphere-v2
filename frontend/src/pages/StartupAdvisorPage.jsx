import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StartupAssessmentForm from '../components/StartupAssessmentForm';
import StartupEvaluationDashboard from '../components/StartupEvaluationDashboard';
import StartupAdvisorChat from '../components/StartupAdvisorChat';
import './StartupAdvisorPage.css';

const StartupAdvisorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('assessment');

  return (
    <div className="advisor-page-container">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate(`/startup/${id}`)}
        style={{ marginBottom: '20px' }}
      >
        &larr; Back to Portfolio
      </button>

      <div className="advisor-header">
        <h1>AI Advisor Dashboard</h1>
        <p>Get personalized insights, evaluate your startup, and chat with your AI Advisor.</p>
      </div>

      <div className="advisor-tabs">
        <button 
          className={`advisor-tab-btn ${currentTab === 'assessment' ? 'active' : ''}`}
          onClick={() => setCurrentTab('assessment')}
        >
          Assessment
        </button>
        <button 
          className={`advisor-tab-btn ${currentTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setCurrentTab('evaluation')}
        >
          Evaluation
        </button>
        <button 
          className={`advisor-tab-btn ${currentTab === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentTab('chat')}
        >
          Chat
        </button>
      </div>

      <div className="advisor-content">
        {currentTab === 'assessment' && (
          <StartupAssessmentForm startupId={id} onEvaluationSuccess={() => setCurrentTab('evaluation')} />
        )}
        {currentTab === 'evaluation' && (
          <StartupEvaluationDashboard startupId={id} />
        )}
        {currentTab === 'chat' && (
          <StartupAdvisorChat startupId={id} />
        )}
      </div>
    </div>
  );
};

export default StartupAdvisorPage;

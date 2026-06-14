import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StartupAssessmentForm from '../components/StartupAssessmentForm';
import StartupEvaluationDashboard from '../components/StartupEvaluationDashboard';
import StartupAdvisorChat from '../components/StartupAdvisorChat';
import Navbar from '../components/Navbar';

const StartupAdvisorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('assessment');

  return (
    <>
      <Navbar />
      <div className="page-container">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(`/startup/${id}`)}
          style={{ marginBottom: '24px' }}
        >
          &larr; Back to Portfolio
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 className="page-title">AI Advisor Dashboard</h1>
          <p className="page-subtitle">Get personalized insights, evaluate your startup, and chat with your AI Advisor.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
          <button 
            className={`btn ${currentTab === 'assessment' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('assessment')}
          >
            Assessment
          </button>
          <button 
            className={`btn ${currentTab === 'evaluation' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('evaluation')}
          >
            Evaluation
          </button>
          <button 
            className={`btn ${currentTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('chat')}
          >
            Chat
          </button>
        </div>

        <div>
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
    </>
  );
};

export default StartupAdvisorPage;
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './StartupEvaluationDashboard.css';

const StartupEvaluationDashboard = ({ startupId }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvaluation();
  }, [startupId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/ai/evaluation/${startupId}`);
      if (res.data && res.data.data) {
        setEvaluation(res.data.data);
      } else {
        setEvaluation(null);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setEvaluation(null);
      } else {
        setError('Could not load evaluation. Please generate an evaluation first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 60) return 'score-yellow';
    return 'score-red';
  };

  if (loading) return <div className="loading-state">Loading evaluation...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!evaluation) return (
    <div className="empty-state">
      <h3>No Evaluation Found</h3>
      <p>Please complete your assessment and generate an evaluation from the Assessment tab.</p>
    </div>
  );

  return (
    <div className="evaluation-dashboard">
      <div className="dashboard-header">
        <h2>AI Evaluation Dashboard</h2>
        <p>Comprehensive analysis of your startup's potential</p>
      </div>

      <div className="score-cards">
        <div className="score-card">
          <h4>AI Score</h4>
          <div className={`score-value ${getScoreColor(evaluation.aiScore)}`}>
            {Math.round(evaluation.aiScore || 0)}
          </div>
        </div>
        <div className="score-card">
          <h4>Founder Fit</h4>
          <div className={`score-value ${getScoreColor(evaluation.founderFitScore)}`}>
            {Math.round(evaluation.founderFitScore || 0)}
          </div>
        </div>
        <div className="score-card">
          <h4>Market Potential</h4>
          <div className={`score-value ${getScoreColor(evaluation.marketPotentialScore)}`}>
            {Math.round(evaluation.marketPotentialScore || 0)}
          </div>
        </div>
        <div className="score-card">
          <h4>Execution</h4>
          <div className={`score-value ${getScoreColor(evaluation.executionScore)}`}>
            {Math.round(evaluation.executionScore || 0)}
          </div>
        </div>
        <div className="score-card">
          <h4>Validation</h4>
          <div className={`score-value ${getScoreColor(evaluation.validationScore)}`}>
            {Math.round(evaluation.validationScore || 0)}
          </div>
        </div>
      </div>

      <div className="verdict-section">
        <h3>Investment Verdict</h3>
        <div className="verdict-value">{evaluation.investmentVerdict}</div>
        <p className="verdict-recommendation">{evaluation.recommendation}</p>
      </div>

      <div className="evaluation-grid">
        <div className="evaluation-section">
          <h3>Strengths</h3>
          <ul>
            {evaluation.strengths?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Weaknesses</h3>
          <ul>
            {evaluation.weaknesses?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Risks</h3>
          <ul>
            {evaluation.risks?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Competitor Threats</h3>
          <ul>
            {evaluation.competitorThreats?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Market Opportunities</h3>
          <ul>
            {evaluation.marketOpportunities?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>MVP Suggestions</h3>
          <ul>
            {evaluation.mvpSuggestions?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Next Milestones</h3>
          <ul>
            {evaluation.nextMilestones?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="evaluation-section">
          <h3>Funding Readiness</h3>
          <p>{evaluation.fundingReadiness}</p>
        </div>
      </div>
    </div>
  );
};

export default StartupEvaluationDashboard;

import React, { useState, useEffect } from 'react';
import API from '../services/api';

const StartupEvaluationDashboard = ({ startupId }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvaluation();
  }, [startupId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      setError('');
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
        setError('Could not load evaluation. Please check your network or try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReevaluate = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await API.post(`/ai/evaluate/${startupId}`);
      if (res.data && res.data.data) {
         setEvaluation(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Quota exceeded. Please try again later.');
      } else if (err.response?.status === 503) {
        setError('AI service is currently unavailable. Please try again later.');
      } else if (err.response?.status >= 500) {
         setError('Server error occurred. Please try again.');
      } else if (!err.response) {
         setError('Network error. Please check your connection.');
      } else {
         setError(err.response?.data?.message || 'Error generating evaluation.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading evaluation...</div>;
  if (generating) return <div className="page-container" style={{ textAlign: 'center' }}>Generating evaluation...</div>;
  if (error) return <div className="alert-error">{error}</div>;
  if (!evaluation) return (
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <h3 className="section-title">No Evaluation Found</h3>
      <p className="muted">Please complete your assessment and generate an evaluation from the Assessment tab.</p>
    </div>
  );

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: '8px' }}>AI Evaluation Dashboard</h2>
          <p className="muted" style={{ margin: 0 }}>Comprehensive analysis of your startup's potential</p>
        </div>
        <button className="btn btn-primary" onClick={handleReevaluate} disabled={generating}>
          Re-evaluate Startup
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 className="muted" style={{ marginBottom: '10px' }}>AI Score</h4>
          <h2 style={{ fontSize: '2rem', color: getScoreColor(evaluation.aiScore) }}>
            {Math.round(evaluation.aiScore || 0)}
          </h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 className="muted" style={{ marginBottom: '10px' }}>Founder Fit</h4>
          <h2 style={{ fontSize: '2rem', color: getScoreColor(evaluation.founderFitScore) }}>
            {Math.round(evaluation.founderFitScore || 0)}
          </h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 className="muted" style={{ marginBottom: '10px' }}>Market Potential</h4>
          <h2 style={{ fontSize: '2rem', color: getScoreColor(evaluation.marketPotentialScore) }}>
            {Math.round(evaluation.marketPotentialScore || 0)}
          </h2>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h4 className="muted" style={{ marginBottom: '10px' }}>Execution</h4>
          <h2 style={{ fontSize: '2rem', color: getScoreColor(evaluation.executionScore) }}>
            {Math.round(evaluation.executionScore || 0)}
          </h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--primary-2)' }}>
        <h3 className="section-title">Investment Verdict</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text)' }}>{evaluation.investmentVerdict}</p>
        <p className="muted" style={{ margin: 0, lineHeight: '1.6' }}>{evaluation.recommendation}</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="section-title">Strengths</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.strengths?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="section-title">Weaknesses</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.weaknesses?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="section-title">Risks</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.risks?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="section-title">Competitor Threats</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.competitorThreats?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="section-title">Market Opportunities</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.marketOpportunities?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="section-title">MVP Suggestions</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.mvpSuggestions?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="section-title">Next Milestones</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {evaluation.nextMilestones?.map((item, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>)}
          </ul>
        </div>
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="section-title">Funding Readiness</h3>
          <p style={{ margin: 0, color: 'var(--text-soft)', lineHeight: '1.6' }}>{evaluation.fundingReadiness}</p>
        </div>
      </div>
    </div>
  );
};

export default StartupEvaluationDashboard;
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './StartupAssessmentForm.css';

const StartupAssessmentForm = ({ startupId, onEvaluationSuccess }) => {
  const [formData, setFormData] = useState({
    targetAudience: '',
    problemStatement: '',
    currentSolution: '',
    differentiator: '',
    currentStage: '',
    revenueModel: '',
    marketLocation: '',
    founderBackground: '',
    industryExperience: '',
    competitors: '',
    customerInterviews: '',
    teamSize: '',
    expectedPricing: '',
    customerAcquisition: ''
  });

  const [assessmentExists, setAssessmentExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssessment();
  }, [startupId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assessments/${startupId}`);
      if (res.data && res.data.data) {
        setFormData((prev) => ({ ...prev, ...res.data.data }));
        setAssessmentExists(true);
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        setError('Failed to fetch assessment data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      if (assessmentExists) {
        await API.put(`/assessments/${startupId}`, formData);
      } else {
        await API.post(`/assessments/${startupId}`, formData);
        setAssessmentExists(true);
      }
      setSuccess('Assessment saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEvaluation = async () => {
    setError('');
    setSuccess('');
    
    if (!assessmentExists) {
      setError('Please save assessment before generating evaluation.');
      return;
    }

    try {
      setEvaluating(true);
      await API.post(`/ai/evaluate/${startupId}`);
      setSuccess('Evaluation generated successfully!');
      if (onEvaluationSuccess) {
        onEvaluationSuccess();
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
        setError(err.response?.data?.message || 'Failed to generate evaluation. Ensure all required fields are filled.');
      }
    } finally {
      setEvaluating(false);
    }
  };

  if (loading && !formData.problemStatement && !assessmentExists) return <div>Loading...</div>;

  return (
    <div className="assessment-form-container">
      <h2>Startup Assessment</h2>
      <p>Provide details about your startup to receive an AI-powered evaluation.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="assessment-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Target Audience <span>*</span></label>
          <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Problem Statement <span>*</span></label>
          <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Current Solution <span>*</span></label>
          <textarea name="currentSolution" value={formData.currentSolution} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Differentiator <span>*</span></label>
          <textarea name="differentiator" value={formData.differentiator} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Current Stage <span>*</span></label>
          <select name="currentStage" value={formData.currentStage} onChange={handleChange} required>
            <option value="">Select Stage</option>
            <option value="Idea">Idea</option>
            <option value="Prototype">Prototype</option>
            <option value="MVP">MVP</option>
            <option value="Early Traction">Early Traction</option>
            <option value="Growth">Growth</option>
          </select>
        </div>

        <div className="form-group">
          <label>Revenue Model <span>*</span></label>
          <input type="text" name="revenueModel" value={formData.revenueModel} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Market Location <span>*</span></label>
          <input type="text" name="marketLocation" value={formData.marketLocation} onChange={handleChange} required />
        </div>

        <h3 className="optional-section-title">Optional Details</h3>

        <div className="form-group">
          <label>Founder Background</label>
          <textarea name="founderBackground" value={formData.founderBackground} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Industry Experience (Years)</label>
          <input type="number" name="industryExperience" value={formData.industryExperience} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Competitors</label>
          <textarea name="competitors" value={formData.competitors} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Customer Interviews Conducted</label>
          <input type="number" name="customerInterviews" value={formData.customerInterviews} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Team Size</label>
          <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Expected Pricing</label>
          <input type="text" name="expectedPricing" value={formData.expectedPricing} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Customer Acquisition Strategy</label>
          <textarea name="customerAcquisition" value={formData.customerAcquisition} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading || evaluating}>
            {loading ? 'Saving...' : (assessmentExists ? 'Update Assessment' : 'Save Assessment')}
          </button>
          <button 
            type="button" 
            className="btn-generate" 
            onClick={handleGenerateEvaluation}
            disabled={loading || evaluating}
          >
            {evaluating ? 'Generating Evaluation...' : 'Generate Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartupAssessmentForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import './InstructorProfileForm.css';

const InstructorProfileForm = () => {
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        city: '',
        country: '',
        phoneNumber: '',
        education: '',
        experience: '',
        expertise: [''],
        certificateUrls: [''],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Check if user is instructor
        if (user?.role !== 'instructor') {
            navigate('/');
        }

        // Check if profile already exists
        checkProfileStatus();
    }, [user, navigate]);

    const checkProfileStatus = async () => {
        try {
            const response = await api.get('/instructor/profile/status');

            if (response.data.data.profileCompleted) {
                navigate('/instructor/profile');
            }
        } catch (err) {
            console.error('Error checking profile status:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExpertiseChange = (index, value) => {
        const newExpertise = [...formData.expertise];
        newExpertise[index] = value;
        setFormData((prev) => ({
            ...prev,
            expertise: newExpertise,
        }));
    };

    const addExpertise = () => {
        if (formData.expertise.length < 5) {
            setFormData((prev) => ({
                ...prev,
                expertise: [...prev.expertise, ''],
            }));
        }
    };

    const removeExpertise = (index) => {
        const newExpertise = formData.expertise.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            expertise: newExpertise.length > 0 ? newExpertise : [''],
        }));
    };

    const handleCertificateChange = (index, value) => {
        const newCertificates = [...formData.certificateUrls];
        newCertificates[index] = value;
        setFormData((prev) => ({
            ...prev,
            certificateUrls: newCertificates,
        }));
    };

    const addCertificate = () => {
        setFormData((prev) => ({
            ...prev,
            certificateUrls: [...prev.certificateUrls, ''],
        }));
    };

    const removeCertificate = (index) => {
        const newCertificates = formData.certificateUrls.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            certificateUrls: newCertificates.length > 0 ? newCertificates : [''],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.city || !formData.country ||
            !formData.phoneNumber || !formData.education || !formData.experience) {
            setError('Please fill in all required fields');
            return;
        }

        // Filter out empty expertise and certificates
        const expertise = formData.expertise.filter((exp) => exp.trim() !== '');
        const certificateUrls = formData.certificateUrls.filter((cert) => cert.trim() !== '');

        if (expertise.length === 0) {
            setError('Please add at least one expertise keyword');
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                expertise,
                certificateUrls,
            };

            const response = await api.post('/instructor/profile/submit', submitData);

            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="instructor-profile-form-container">
            <div className="instructor-profile-form-wrapper">
                <div className="form-header">
                    <h1>Complete Your Instructor Profile</h1>
                    <p>Please provide the following information to complete your instructor application</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="instructor-profile-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter your city"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country *</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Enter your country"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number *</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="education">Education *</label>
                        <textarea
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="Describe your educational background"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="experience">Experience *</label>
                        <textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Describe your professional experience"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Expertise (Max 5 keywords) *</label>
                        {formData.expertise.map((exp, index) => (
                            <div key={index} className="dynamic-input-group">
                                <input
                                    type="text"
                                    value={exp}
                                    onChange={(e) => handleExpertiseChange(index, e.target.value)}
                                    placeholder={`Expertise keyword ${index + 1}`}
                                />
                                {formData.expertise.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeExpertise(index)}
                                        className="btn-remove"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.expertise.length < 5 && (
                            <button
                                type="button"
                                onClick={addExpertise}
                                className="btn-add"
                            >
                                + Add Expertise
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Certificate URLs (Optional)</label>
                        {formData.certificateUrls.map((cert, index) => (
                            <div key={index} className="dynamic-input-group">
                                <input
                                    type="url"
                                    value={cert}
                                    onChange={(e) => handleCertificateChange(index, e.target.value)}
                                    placeholder={`Certificate URL ${index + 1}`}
                                />
                                {formData.certificateUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCertificate(index)}
                                        className="btn-remove"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addCertificate}
                            className="btn-add"
                        >
                            + Add Certificate
                        </button>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstructorProfileForm;

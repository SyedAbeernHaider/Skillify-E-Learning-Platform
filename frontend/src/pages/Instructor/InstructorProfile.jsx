import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './InstructorProfile.css';

const InstructorProfile = () => {
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        country: '',
        phoneNumber: '',
        education: '',
        experience: '',
        expertise: [''],
        certificateUrls: [''],
    });

    useEffect(() => {
        if (user?.role !== 'instructor') {
            navigate('/');
            return;
        }
        fetchProfile();
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/instructor/profile');

            setProfile(response.data.data);
            setFormData({
                name: response.data.data.name || '',
                city: response.data.data.city || '',
                country: response.data.data.country || '',
                phoneNumber: response.data.data.phoneNumber || '',
                education: response.data.data.education || '',
                experience: response.data.data.experience || '',
                expertise: response.data.data.expertise?.length > 0 ? response.data.data.expertise : [''],
                certificateUrls: response.data.data.certificateUrls?.length > 0 ? response.data.data.certificateUrls : [''],
            });
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
            setLoading(false);
            if (err.response?.status === 404) {
                navigate('/instructor/profile/complete');
            }
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

    const handleSave = async () => {
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.city || !formData.country ||
            !formData.phoneNumber || !formData.education || !formData.experience) {
            setError('Please fill in all required fields');
            return;
        }

        const expertise = formData.expertise.filter((exp) => exp.trim() !== '');
        const certificateUrls = formData.certificateUrls.filter((cert) => cert.trim() !== '');

        if (expertise.length === 0) {
            setError('Please add at least one expertise keyword');
            return;
        }

        setSaving(true);

        try {
            const updateData = {
                ...formData,
                expertise,
                certificateUrls,
            };

            const response = await api.put('/instructor/profile', updateData);

            setProfile(response.data.data);
            setSuccess('Profile updated successfully');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile.name || '',
            city: profile.city || '',
            country: profile.country || '',
            phoneNumber: profile.phoneNumber || '',
            education: profile.education || '',
            experience: profile.experience || '',
            expertise: profile.expertise?.length > 0 ? profile.expertise : [''],
            certificateUrls: profile.certificateUrls?.length > 0 ? profile.certificateUrls : [''],
        });
        setIsEditing(false);
        setError('');
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { text: 'Pending Approval', class: 'status-pending' },
            approved: { text: 'Approved', class: 'status-approved' },
            rejected: { text: 'Rejected', class: 'status-rejected' },
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <div className="instructor-profile-container">
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="instructor-profile-container">
                <div className="error-message">Profile not found</div>
            </div>
        );
    }

    const statusBadge = getStatusBadge(profile.approvalStatus);

    return (
        <div className="instructor-profile-container">
            <div className="instructor-profile-wrapper">
                <div className="profile-header">
                    <div className="header-content">
                        <h1>Instructor Profile</h1>
                        <span className={`status-badge ${statusBadge.class}`}>
                            {statusBadge.text}
                        </span>
                    </div>
                    {!isEditing && profile.approvalStatus !== 'approved' && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-edit"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {isEditing ? (
                    <div className="profile-form">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Education *</label>
                            <textarea
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience *</label>
                            <textarea
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>Expertise (Max 5) *</label>
                            {formData.expertise.map((exp, index) => (
                                <div key={index} className="dynamic-input-group">
                                    <input
                                        type="text"
                                        value={exp}
                                        onChange={(e) => handleExpertiseChange(index, e.target.value)}
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
                                <button onClick={addExpertise} className="btn-add">
                                    + Add Expertise
                                </button>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Certificate URLs</label>
                            {formData.certificateUrls.map((cert, index) => (
                                <div key={index} className="dynamic-input-group">
                                    <input
                                        type="url"
                                        value={cert}
                                        onChange={(e) => handleCertificateChange(index, e.target.value)}
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
                            <button onClick={addCertificate} className="btn-add">
                                + Add Certificate
                            </button>
                        </div>

                        <div className="form-actions">
                            <button
                                onClick={handleCancel}
                                className="btn-cancel"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-save"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-view">
                        <div className="profile-section">
                            <h3>Personal Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Name</label>
                                    <p>{profile.name}</p>
                                </div>
                                <div className="info-item">
                                    <label>Email</label>
                                    <p>{profile.user?.email}</p>
                                </div>
                                <div className="info-item">
                                    <label>City</label>
                                    <p>{profile.city}</p>
                                </div>
                                <div className="info-item">
                                    <label>Country</label>
                                    <p>{profile.country}</p>
                                </div>
                                <div className="info-item">
                                    <label>Phone Number</label>
                                    <p>{profile.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Professional Background</h3>
                            <div className="info-item">
                                <label>Education</label>
                                <p>{profile.education}</p>
                            </div>
                            <div className="info-item">
                                <label>Experience</label>
                                <p>{profile.experience}</p>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Expertise</h3>
                            <div className="expertise-tags">
                                {profile.expertise?.map((exp, index) => (
                                    <span key={index} className="expertise-tag">
                                        {exp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {profile.certificateUrls?.length > 0 && profile.certificateUrls[0] !== '' && (
                            <div className="profile-section">
                                <h3>Certificates</h3>
                                <div className="certificate-list">
                                    {profile.certificateUrls.map((cert, index) => (
                                        cert && (
                                            <a
                                                key={index}
                                                href={cert}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="certificate-link"
                                            >
                                                Certificate {index + 1}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="profile-section">
                            <h3>Application Status</h3>
                            <div className="info-item">
                                <label>Submitted At</label>
                                <p>{new Date(profile.submittedAt).toLocaleDateString()}</p>
                            </div>
                            {profile.reviewedAt && (
                                <div className="info-item">
                                    <label>Reviewed At</label>
                                    <p>{new Date(profile.reviewedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                            {profile.rejectionReason && (
                                <div className="info-item">
                                    <label>Rejection Reason</label>
                                    <p className="rejection-reason">{profile.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorProfile;

import { useEffect, useState } from 'react';
import { FaCog, FaSpinner, FaSave, FaUserPlus, FaChalkboardTeacher, FaPercentage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPlatformSettings, updatePlatformSettings } from '../../services/api/adminService';

function AdminSettings() {
    const [settings, setSettings] = useState({
        platformFeePercentage: 10,
        studentRegistrationEnabled: true,
        instructorRegistrationEnabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await getPlatformSettings();
            setSettings(response.data || {});
        } catch (error) {
            console.error(error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updatePlatformSettings(settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Settings...</p>
                </div>
                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 80vh;
                        gap: 1.5rem;
                    }
                     .loading-spinner {
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e5e7eb;
                        border-top: 4px solid #7c3aed;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                    .loading-text {
                        font-size: 1.125rem;
                        color: #6b7280;
                        font-weight: 500;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="settings-page">
            <h1 className="page-title">⚙️ Platform Settings</h1>

            <div className="settings-grid">
                {/* Platform Fee Card */}
                <div className="setting-card">
                    <div className="card-header">
                        <div className="icon-wrapper fee">
                            <FaPercentage />
                        </div>
                        <div className="header-text">
                            <h3>Platform Fee Configuration</h3>
                            <p>Set the percentage fee taken from course sales</p>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="input-group">
                            <label>Platform Fee (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={settings.platformFeePercentage}
                                onChange={(e) => setSettings({ ...settings, platformFeePercentage: parseFloat(e.target.value) })}
                                className="styled-input"
                            />
                            <p className="helper-text">This percentage will be deducted from all future course sales.</p>
                        </div>
                    </div>
                </div>

                {/* Registration Controls Card */}
                <div className="setting-card">
                    <div className="card-header">
                        <div className="icon-wrapper registration">
                            <FaUserPlus />
                        </div>
                        <div className="header-text">
                            <h3>Registration Controls</h3>
                            <p>Manage who can sign up for the platform</p>
                        </div>
                    </div>
                    <div className="card-body">
                        {/* Student Registration Toggle */}
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <h4>Student Registration</h4>
                                <p>Allow new students to create accounts</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.studentRegistrationEnabled}
                                    onChange={(e) => setSettings({ ...settings, studentRegistrationEnabled: e.target.checked })}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="divider"></div>
                        {/* Instructor Registration Toggle */}
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <h4>Instructor Registration</h4>
                                <p>Allow new instructors to apply</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.instructorRegistrationEnabled}
                                    onChange={(e) => setSettings({ ...settings, instructorRegistrationEnabled: e.target.checked })}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="actions-bar">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="save-btn"
                >
                    {saving ? (
                        <>
                            <div className="btn-spinner"></div>
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <FaSave /> Save Settings
                        </>
                    )}
                </button>
            </div>

            <style jsx>{`
                .settings-page {
                    padding: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 2rem;
                }

                .settings-grid {
                    display: grid;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .setting-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .setting-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .icon-wrapper {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                }

                .icon-wrapper.fee {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }

                .icon-wrapper.registration {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                }

                .header-text h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .header-text p {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    font-weight: 600;
                    color: #374151;
                }

                .styled-input {
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }

                .styled-input:focus {
                    border-color: #7c3aed;
                    outline: none;
                }

                .helper-text {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin: 0;
                }

                .toggle-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                }

                .toggle-info h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                    margin: 0 0 0.25rem 0;
                }

                .toggle-info p {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .divider {
                    height: 1px;
                    background: #f3f4f6;
                    margin: 1.5rem 0;
                }

                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                }

                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }

                input:checked + .slider {
                    background-color: #7c3aed;
                }

                input:focus + .slider {
                    box-shadow: 0 0 1px #7c3aed;
                }

                input:checked + .slider:before {
                    transform: translateX(26px);
                }

                .slider.round {
                    border-radius: 34px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }

                .actions-bar {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }

                .save-btn {
                    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.4);
                }

                .save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default AdminSettings;

'use client';

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.scss';

const PatientProfile: React.FC = () => {
    const router = useRouter();
    const [patientId, setPatientId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
    const [emergencyContact, setEmergencyContact] = useState({ name: '', relation: '', phone: '' });
    const [insuranceProvider, setInsuranceProvider] = useState({ name: '', policyNumber: '', coverage: '' });
    const [medicalHistory, setMedicalHistory] = useState([{ condition: '', dateDiagnosed: '', notes: '' }]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = sessionStorage.getItem('_id');
        setPatientId(id);
        if (id) fetchPatientProfile(id);
    }, []);

    const fetchPatientProfile = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/patients/getProfile?patientId=${id}`);
            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                setAge(data.age);
                setGender(data.gender);
                setDateOfBirth(data.dateOfBirth);
                setPhone(data.phone);
                setEmail(data.email);
                setAddress(data.address);
                setEmergencyContact(data.emergencyContact);
                setInsuranceProvider(data.insuranceProvider);
                setMedicalHistory(data.medicalHistory);
                if (data.profileImage) setProfileImageURL(data.profileImage);
            } else {
                setError(true);
                setMessage(data.message || 'Patient not found. Please fill in your details.');
            }
        } catch (error) {
            console.error('Error fetching patient profile:', error);
            setError(true);
            setMessage('Error fetching patient profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setProfileImage(files[0]);
            setProfileImageURL(URL.createObjectURL(files[0]));
        } else {
            setProfileImage(null);
        }
    };

    const handleMedicalHistoryChange = (index: number, field: string, value: string) => {
        setMedicalHistory((prev: any) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleAddMedicalHistory = () => {
        setMedicalHistory((prev) => [...prev, { condition: '', dateDiagnosed: '', notes: '' }]);
    };

    const handleRemoveMedicalHistory = (index: number) => {
        setMedicalHistory((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('patientId', patientId!);
        formData.append('name', name);
        formData.append('age', String(age));
        formData.append('gender', gender);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', JSON.stringify(address));
        formData.append('emergencyContact', JSON.stringify(emergencyContact));
        formData.append('insuranceProvider', JSON.stringify(insuranceProvider));
        formData.append('medicalHistory', JSON.stringify(medicalHistory));
        if (profileImage) formData.append('profileImage', profileImage);

        const response = await fetch('/api/patients/createOrUpdate', { method: 'POST', body: formData });
        const result = await response.json();
        if (response.ok) {
            setMessage('Profile updated successfully!');
            setError(false);
        } else {
            setMessage(result.message || 'Error updating profile.');
            setError(true);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profileImageURL ? (
                            <img src={profileImageURL} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                <span>{name ? name.charAt(0).toUpperCase() : 'P'}</span>
                            </div>
                        )}
                        <label className="avatar-upload">
                            <input type="file" onChange={handleProfileImageChange} accept="image/*" hidden />
                            <span>Change Photo</span>
                        </label>
                    </div>
                    <div className="profile-title">
                        <h2>{name || 'Patient Profile'}</h2>
                        <p className="subtitle">Manage your health information</p>
                    </div>
                </div>

                {message && (
                    <div className={`profile-alert ${error ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h3 className="section-title">Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input type="number" placeholder="25" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value as any)} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="patient@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Address</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" placeholder="123 Main St" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" placeholder="New York" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" placeholder="NY" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input type="text" placeholder="10001" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Emergency Contact</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Contact Name</label>
                                <input type="text" placeholder="Jane Doe" value={emergencyContact.name} onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Relation</label>
                                <input type="text" placeholder="Spouse" value={emergencyContact.relation} onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" placeholder="+1 234 567 890" value={emergencyContact.phone} onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Insurance</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Provider</label>
                                <input type="text" placeholder="Blue Cross" value={insuranceProvider.name} onChange={(e) => setInsuranceProvider({ ...insuranceProvider, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Policy Number</label>
                                <input type="text" placeholder="POL-123456" value={insuranceProvider.policyNumber} onChange={(e) => setInsuranceProvider({ ...insuranceProvider, policyNumber: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Coverage</label>
                                <input type="text" placeholder="Full Coverage" value={insuranceProvider.coverage} onChange={(e) => setInsuranceProvider({ ...insuranceProvider, coverage: e.target.value })} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <h3 className="section-title">Medical History</h3>
                            <button type="button" className="add-btn" onClick={handleAddMedicalHistory}>+ Add Record</button>
                        </div>
                        {medicalHistory.map((history, index) => (
                            <div key={index} className="history-card">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Condition</label>
                                        <input type="text" placeholder="Diabetes" value={history.condition} onChange={(e) => handleMedicalHistoryChange(index, 'condition', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date Diagnosed</label>
                                        <input type="date" value={history.dateDiagnosed} onChange={(e) => handleMedicalHistoryChange(index, 'dateDiagnosed', e.target.value)} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Notes</label>
                                        <input type="text" placeholder="Additional notes..." value={history.notes} onChange={(e) => handleMedicalHistoryChange(index, 'notes', e.target.value)} />
                                    </div>
                                </div>
                                <button type="button" className="remove-history" onClick={() => handleRemoveMedicalHistory(index)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
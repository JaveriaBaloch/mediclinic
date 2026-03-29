'use client';

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './style.scss';

const DoctorProfile: React.FC = () => {
    const router = useRouter();
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = sessionStorage.getItem('_id');
        setDoctorId(id);
        if (id) {
            fetchDoctorProfile(id);
        }
    }, []);

    const fetchDoctorProfile = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/doctors/getProfile?doctorId=${id}`);
            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                setSpecialty(data.specialty);
                setPhone(data.phone);
                setEmail(data.email);
                if (data.profileImage) {
                    setProfileImage(new File([], data.profileImage));
                }
                const docFiles = data.documents.map((doc: string) => new File([], doc));
                setUploadedDocs(docFiles);
            } else {
                setError(true);
                setMessage(data.message || 'Doctor not found. Please fill in your details.');
            }
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
            setError(true);
            setMessage('Error fetching doctor profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setProfileImage(files[0]);
        } else {
            setProfileImage(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedDocs((prevDocs) => [...prevDocs, file]);
            event.target.value = '';
        }
    };

    const handleRemoveDocument = (index: number) => {
        setUploadedDocs((prevDocs) => prevDocs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('doctorId', doctorId || '');
        formData.append('name', name);
        formData.append('specialty', specialty);
        formData.append('phone', phone);
        formData.append('email', email);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
        uploadedDocs.forEach((doc) => {
            formData.append('files', doc);
        });
        setLoading(true);
        try {
            const response = await fetch('/api/doctors/createOrUpdate', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                setError(false);
                setUploadedDocs([]);
                setProfileImage(null);
            } else {
                setError(true);
                setMessage(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error saving doctor profile:', error);
            setError(true);
            setMessage('Error saving doctor profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profileImage ? (
                            <img src={URL.createObjectURL(profileImage)} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                <span>{name ? name.charAt(0).toUpperCase() : 'D'}</span>
                            </div>
                        )}
                        <label className="avatar-upload">
                            <input type="file" onChange={handleProfileImageChange} accept="image/*" hidden />
                            <span>Change Photo</span>
                        </label>
                    </div>
                    <div className="profile-title">
                        <h2>{name || 'Doctor Profile'}</h2>
                        <p className="subtitle">{specialty || 'Complete your profile below'}</p>
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
                                <input type="text" placeholder="Dr. John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Specialty</label>
                                <input type="text" placeholder="Cardiology" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="doctor@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Documents</h3>
                        <div className="upload-area">
                            <label className="upload-trigger">
                                <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} hidden />
                                <div className="upload-content">
                                    <span className="upload-icon">+</span>
                                    <span>Upload Document</span>
                                    <small>PDF or Image files</small>
                                </div>
                            </label>
                        </div>
                        {uploadedDocs.length > 0 && (
                            <div className="doc-list">
                                {uploadedDocs.map((doc, index) => (
                                    <div key={index} className="doc-item">
                                        <span className="doc-name">{doc.name}</span>
                                        <button type="button" onClick={() => handleRemoveDocument(index)} className="doc-remove">Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
'use client';

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const [loading, setLoading] = useState(false); // New loading state

    useEffect(() => {
        const id = sessionStorage.getItem('_id');
        setDoctorId(id);
        if (id) {
            fetchDoctorProfile(id);
        }
    }, []);

    const fetchDoctorProfile = async (id: string) => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`/api/doctors/getProfile?doctorId=${id}`);
            const data = await response.json();

            if (response.ok) {
                setName(data.name);
                setSpecialty(data.specialty);
                setPhone(data.phone);
                setEmail(data.email);
                if (data.profileImage) {
                    setProfileImage(new File([], data.profileImage)); // Adjust this if needed
                }
                const docFiles = data.documents.map((doc: string) => new File([], doc)); // Adjust if necessary
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
            setLoading(false); // End loading
        }
    };
      const handleProfileImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
           const files = event.target.files;
           if (files && files.length > 0) {
               setProfileImage(files[0]);
           } else {
               setProfileImage(null); // Reset if no file selected
           }
       };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedDocs((prevDocs) => [...prevDocs, file]);
            event.target.value = ''; // Clear input for same file uploads
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
        setLoading(true); // Start loading
        try {
            const response = await fetch('/api/doctors/createOrUpdate', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
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
            setLoading(false); // End loading
        }
    };

    return (
        <div className="container mt-5">
            <h2>Doctor Profile</h2>
            {loading && <p>Loading...</p>} {/* Loading state */}
            {message && <div className={`alert ${error ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder="Specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                />
                <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {profileImage && (
                    <div>
                        <h5>Current Profile Picture:</h5>
                        <img src={URL.createObjectURL(profileImage)} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    </div>
                )}
                <div className="mb-3">
                <input
    type="file"
    onChange={handleProfileImageChange}
    accept="image/*"
/>

                </div>

                
                <div className="mb-3">
                    <label htmlFor="documents" className="form-label">Upload Document</label>
                    <input
                        type="file"
                        className="form-control"
                        id="documents"
                        accept="application/pdf,image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <h5>Uploaded Documents:</h5>
                <ul className="list-group mb-3">
                    {uploadedDocs.map((doc, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {doc.name}
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveDocument(index)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <button type="submit" className="btn btn-success">Submit</button>
            </form>
        </div>
    );
};

export default DoctorProfile;

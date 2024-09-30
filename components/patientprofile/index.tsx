'use client';

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PatientProfile: React.FC = () => {
    const router = useRouter();
    const [patientId, setPatientId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });
    const [emergencyContact, setEmergencyContact] = useState({
        name: '',
        relation: '',
        phone: '',
    });
    const [insuranceProvider, setInsuranceProvider] = useState({
        name: '',
        policyNumber: '',
        coverage: '',
    });
    const [medicalHistory, setMedicalHistory] = useState([{ condition: '', dateDiagnosed: '', notes: '' }]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageURL, setProfileImageURL] = useState<string | null>(null); // For displaying the profile image
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = sessionStorage.getItem('_id');
        setPatientId(id);
        if (id) {
            fetchPatientProfile(id);
        }
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
                
                // Handle the profile image URL
                if (data.profileImage) {
                    setProfileImageURL(data.profileImage); // Set the URL for the image
                }
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
            console.log('Selected file:', files[0].name); // Log the selected file name
        } else {
            setProfileImage(null); // Reset if no file selected
        }
    };

    const handleMedicalHistoryChange = (index: number, field: string, value: string) => {
        setMedicalHistory((prev:any) => {
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
        formData.append('patientId', patientId!); // Non-null assertion since patientId is set on load
        formData.append('name', name);
        formData.append('age', String(age)); // Convert age to string
        formData.append('gender', gender);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', JSON.stringify(address));
        formData.append('emergencyContact', JSON.stringify(emergencyContact));
        formData.append('insuranceProvider', JSON.stringify(insuranceProvider));
        formData.append('medicalHistory', JSON.stringify(medicalHistory));
        
        // Append the file if it exists
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
    
        const response = await fetch('/api/patients/createOrUpdate', {
            method: 'POST',
            body: formData,
        });
    
        const result = await response.json();
        console.log(result);
        if (response.ok) {
            setMessage('Profile updated successfully!');
            setError(false);
        } else {
            setMessage(result.message || 'Error updating profile.');
            setError(true);
        }
    };
    
    return (
        <div className="container mt-5">
            <h2>Patient Profile</h2>
            {loading && <p>Loading...</p>}
            {message && <div className={`alert ${error ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
            {profileImageURL && <img src={profileImageURL} alt="Profile" className="mb-3" style={{ maxWidth: '200px' }} />} {/* Display the profile image */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        required
                    />
                </div>
                <div className="mb-3">
                    <select
                        className="form-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Date of Birth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <h5>Address</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Zip"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        required
                    />
                </div>
                <h5>Emergency Contact</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Relation"
                        value={emergencyContact.relation}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                        required
                    />
                </div>
                <h5>Insurance Provider</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Provider Name"
                        value={insuranceProvider.name}
                        onChange={(e) => setInsuranceProvider({ ...insuranceProvider, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Policy Number"
                        value={insuranceProvider.policyNumber}
                        onChange={(e) => setInsuranceProvider({ ...insuranceProvider, policyNumber: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Coverage"
                        value={insuranceProvider.coverage}
                        onChange={(e) => setInsuranceProvider({ ...insuranceProvider, coverage: e.target.value })}
                        required
                    />
                </div>
                <h5>Medical History</h5>
                {medicalHistory.map((history, index) => (
                    <div key={index} className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Condition"
                            value={history.condition}
                            onChange={(e) => handleMedicalHistoryChange(index, 'condition', e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Date Diagnosed"
                            value={history.dateDiagnosed}
                            onChange={(e) => handleMedicalHistoryChange(index, 'dateDiagnosed', e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Notes"
                            value={history.notes}
                            onChange={(e) => handleMedicalHistoryChange(index, 'notes', e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-danger mt-2"
                            onClick={() => handleRemoveMedicalHistory(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={handleAddMedicalHistory}
                >
                    Add Medical History
                </button>
                <div className="mb-3">
                    <label htmlFor="profileImage" className="form-label">Profile Image</label>
                    <input
                        type="file"
                        className="form-control"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default PatientProfile;

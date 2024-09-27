'use client'
import Navbar from '@/components/navbar';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const profileImage = sessionStorage.getItem('profilePicture')
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [patientData, setPatientData] = useState({
        
        name: 'Patient Name',
        email: 'patient@example.com',
        phone: '+1234567890',
        dob: '01/01/1990',
        gender: 'Male',
        bloodType: 'O+',
        medicalHistory: [
            { id: 1, description: 'Hypertension' },
            { id: 2, description: 'Allergy to Penicillin' },
            { id: 3, description: 'Diabetes Type 2' },
        ],
        emergencyContact: {
            name: 'John Doe',
            relation: 'Brother',
            phone: '+0987654321',
        },
        insuranceProvider: {
            name: 'Health Insurance Co.',
            policyNumber: '123456789',
            coverage: 'Full Coverage',
        },
    });
    const [newMedicalHistory, setNewMedicalHistory] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const { value } = e.target;
        setPatientData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Logic to save the updated data (e.g., API call)
        console.log('Updated Patient Data:', patientData);
        setIsEditing(false);
    };

    const handleAddMedicalHistory = () => {
        if (newMedicalHistory.trim()) {
            const newEntry = {
                id: Date.now(),
                description: newMedicalHistory,
            };
            setPatientData((prev) => ({
                ...prev,
                medicalHistory: [...prev.medicalHistory, newEntry],
            }));
            setNewMedicalHistory('');
        }
    };

    const handleRemoveMedicalHistory = (id: number) => {
        setPatientData((prev) => ({
            ...prev,
            medicalHistory: prev.medicalHistory.filter(entry => entry.id !== id),
        }));
    };

    return (
        <div className="container mt-5">
        
               <Navbar activeItem={-1}/>

            <div className="profile-overview text-center mb-4  mt-5 pt-5">
                <img src={profileImage?profileImage:''} alt="Profile" className="rounded-circle mt-5" style={{ width: '150px', height: '150px' }} />
                {isEditing ? (
                    <>
                        <input 
                            type="text" 
                            value={patientData.name} 
                            onChange={(e) => handleChange(e, 'name')} 
                            className="form-control my-2" 
                        />
                        <input 
                            type="email" 
                            value={patientData.email} 
                            onChange={(e) => handleChange(e, 'email')} 
                            className="form-control my-2" 
                        />
                        <input 
                            type="tel" 
                            value={patientData.phone} 
                            onChange={(e) => handleChange(e, 'phone')} 
                            className="form-control my-2" 
                        />
                    </>
                ) : (
                    <>
                        <h1>{patientData.name}</h1>
                        <p>Email: {patientData.email}</p>
                        <p>Phone: {patientData.phone}</p>
                    </>
                )}
                {isEditing ? (
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                ) : (
                    <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
                <button  className="btn btn-danger ms-4"
                onClick={()=>{
                    sessionStorage.removeItem("_id");
                    sessionStorage.removeItem("username");
                    sessionStorage.removeItem("profilePicture");
                    sessionStorage.removeItem("email");
                    sessionStorage.removeItem("role");
                    router.push('/')                
                
                }}
                >
                    Sign Out
                </button>
            </div>

            <section className="medical-info mb-4">
                <h2>Medical Information</h2>
                <div className="row">
                    <div className="col-md-4">
                        <p>Date of Birth: {isEditing ? <input type="date" value={patientData.dob} onChange={(e) => handleChange(e, 'dob')} className="form-control" /> : patientData.dob}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Gender: {isEditing ? <input type="text" value={patientData.gender} onChange={(e) => handleChange(e, 'gender')} className="form-control" /> : patientData.gender}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Blood Type: {isEditing ? <input type="text" value={patientData.bloodType} onChange={(e) => handleChange(e, 'bloodType')} className="form-control" /> : patientData.bloodType}</p>
                    </div>
                </div>
                <h3>Medical History</h3>
                <ul className="list-group mb-3">
                    {patientData.medicalHistory.map((entry) => (
                        <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {entry.description}
                            {isEditing && (
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMedicalHistory(entry.id)}>
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing && (
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add new medical history"
                            value={newMedicalHistory}
                            onChange={(e) => setNewMedicalHistory(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" onClick={handleAddMedicalHistory}>Add</button>
                    </div>
                )}
                <h3>Emergency Contact</h3>
                <div className="row">
                    <div className="col-md-4">
                        <p>Name: {isEditing ? <input type="text" value={patientData.emergencyContact.name} onChange={(e) => handleChange(e, 'emergencyContact.name')} className="form-control" /> : patientData.emergencyContact.name}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Relation: {isEditing ? <input type="text" value={patientData.emergencyContact.relation} onChange={(e) => handleChange(e, 'emergencyContact.relation')} className="form-control" /> : patientData.emergencyContact.relation}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Phone: {isEditing ? <input type="tel" value={patientData.emergencyContact.phone} onChange={(e) => handleChange(e, 'emergencyContact.phone')} className="form-control" /> : patientData.emergencyContact.phone}</p>
                    </div>
                </div>
            </section>

            <section className="insurance-provider mb-4">
                <h2>Insurance Provider</h2>
                <div className="row">
                    <div className="col-md-4">
                        <p>Name: {isEditing ? <input type="text" value={patientData.insuranceProvider.name} onChange={(e) => handleChange(e, 'insuranceProvider.name')} className="form-control" /> : patientData.insuranceProvider.name}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Policy Number: {isEditing ? <input type="text" value={patientData.insuranceProvider.policyNumber} onChange={(e) => handleChange(e, 'insuranceProvider.policyNumber')} className="form-control" /> : patientData.insuranceProvider.policyNumber}</p>
                    </div>
                    <div className="col-md-4">
                        <p>Coverage: {isEditing ? <input type="text" value={patientData.insuranceProvider.coverage} onChange={(e) => handleChange(e, 'insuranceProvider.coverage')} className="form-control" /> : patientData.insuranceProvider.coverage}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;

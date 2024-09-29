import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientProfile = () => {
    const [patient, setPatient] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<any>({
        patientId: '',
        name: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
        },
        emergencyContact: {
            name: '',
            relation: '',
            phone: '',
        },
        insuranceProvider: {
            name: '',
            policyNumber: '',
            coverage: '',
        },
    });

    useEffect(() => {
        const fetchPatientData = async () => {
            const patientId = sessionStorage.getItem('_id');
            if (patientId) {
                try {
                    const response = await axios.get(`/api/patients/getProfile?patientId=${patientId}`);
                    setPatient(response.data);
                    setFormData({ ...response.data, patientId }); // Populate form data with fetched data
                } catch (err) {
                    console.error('Error fetching patient data:', err);
                    setError('Patient not found. Please fill in your details.');
                    setFormData((prev: any) => ({ ...prev, patientId })); // Include patientId in form data
                } finally {
                    setLoading(false);
                }
            } else {
                setError('Patient ID is not found in session storage.');
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value,
            },
        });
    };

    const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            emergencyContact: {
                ...formData.emergencyContact,
                [name]: value,
            },
        });
    };

    const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            insuranceProvider: {
                ...formData.insuranceProvider,
                [name]: value,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('/api/patients/createOrUpdate', { ...formData });
            alert('Patient data saved successfully!');
        } catch (error) {
            console.error('Error saving patient data:', error);
            alert('Failed to save patient data.');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h1>Patient Profile</h1>
            {error && <div className="alert alert-warning">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Patient ID is not editable by the user */}
                <input type="hidden" name="patientId" value={formData.patientId} />

                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <h5>Address</h5>
                <div className="mb-3">
                    <label className="form-label">Street</label>
                    <input
                        type="text"
                        className="form-control"
                        name="street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                        type="text"
                        className="form-control"
                        name="zip"
                        value={formData.address.zip}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <h5>Emergency Contact</h5>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Relation</label>
                    <input
                        type="text"
                        className="form-control"
                        name="relation"
                        value={formData.emergencyContact.relation}
                        onChange={handleEmergencyContactChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                        required
                    />
                </div>
                <h5>Insurance Provider</h5>
                <div className="mb-3">
                    <label className="form-label">Provider Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.insuranceProvider.name}
                        onChange={handleInsuranceChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Policy Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="policyNumber"
                        value={formData.insuranceProvider.policyNumber}
                        onChange={handleInsuranceChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Coverage</label>
                    <input
                        type="text"
                        className="form-control"
                        name="coverage"
                        value={formData.insuranceProvider.coverage}
                        onChange={handleInsuranceChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-gradient">Save</button>
            </form>
        </div>
    );
};

export default PatientProfile;

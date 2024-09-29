import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DoctorProfile: React.FC = () => {
    const router = useRouter();
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<File[]>([]); // For displaying selected documents
    const [message, setMessage] = useState('');

    useEffect(() => {
        const id = sessionStorage.getItem('_id');
        setDoctorId(id);
        if (id) {
            fetchDoctorProfile(id);
        }
    }, []);

    const fetchDoctorProfile = async (id: string) => {
        try {
            const response = await fetch(`/api/doctors/getProfile?doctorId=${id}`);
            const data = await response.json();

            if (response.ok) {
                setName(data.name);
                setSpecialty(data.specialty);
                setPhone(data.phone);
                setEmail(data.email);
                setProfileImage(data.profileImage);
                // Load documents from the existing profile, if any
                const docFiles = data.documents.map((doc: string) => new File([], doc)); // Mocking File objects from URLs
                setUploadedDocs(docFiles);
            } else {
                setMessage(data.message || 'Doctor not found. Please fill in your details.');
            }
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
            setMessage('Error fetching doctor profile.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedDocs((prevDocs) => [...prevDocs, file]); // Add the new file to the uploaded documents
            event.target.value = ''; // Clear the input to allow re-uploading the same file
        }
    };

    const handleRemoveDocument = (index: number) => {
        setUploadedDocs((prevDocs) => prevDocs.filter((_, i) => i !== index)); // Remove document at index
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('doctorId', doctorId || '');
        formData.append('name', name);
        formData.append('specialty', specialty);
        formData.append('phone', phone);
        formData.append('profileImage', profileImage as Blob);
        formData.append('email', email);
    
        // Append uploaded documents to FormData
        uploadedDocs.forEach((doc) => {
            formData.append('files', doc); // Append actual File objects
        });
    
        try {
            const response = await fetch('/api/doctors/createOrUpdate', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
    
            if (response.ok) {
                setUploadedDocs([]); // Clear the document list after submission
                setProfileImage(null); // Clear the profile image
            } else {
                setMessage(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error saving doctor profile:', error);
            setMessage('Error saving doctor profile.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Doctor Profile</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="specialty" className="form-label">Specialty</label>
                    <input
                        type="text"
                        className="form-control"
                        id="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        id="profilePicture"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
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
                            {doc.name} {/* Display the file name */}
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

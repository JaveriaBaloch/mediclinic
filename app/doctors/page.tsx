'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DoctorsCard } from '@/components/doctorsCard';
import { IAppointment } from '@/model/AppointmentModal';
import { SectionHeadings } from '@/components/sectionHeadings';
import Navbar from '@/components/navbar';
import { IDoctor } from '@/model/doctorModal';
import { AppointmentCard } from '@/components/meetings';
import { Icon } from '@/components/icons/icon';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; // Importing useRouter for navigation
import { HomepageFeaturedDoctorsSection } from '@/components/homepageSections/DoctorsSection';

const Appointments = () => {
    const [appointments, setAppointments] = useState<Array<IAppointment>>([]);
    const [doctors, setDoctors] = useState<Array<IDoctor>>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;
    const router = useRouter(); // Initialize router for navigation

    useEffect(() => {
        const fetchData = async () => {
            const role = sessionStorage.getItem('role');
            const id = sessionStorage.getItem('_id');

            try {
                if (role === 'doctor') {
                    const response = await axios.get(`http://localhost:3000/api/appointments/getAllDoctorsById?id=${id}`);
                    if (response.data.success) {
                        setAppointments(response.data.appointments);
                    } else {
                        console.error('Error fetching appointments:', response.data.message);
                    }
                } else if (role === 'patient') {
                    const response = await axios.get(`http://localhost:3000/api/doctors/getAll`);
                    if (response.data.success) {
                        setDoctors(response.data.doctors);
                    } else {
                        console.error('Error fetching doctors:', response.data.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Function to add a contact
    const handleAddContact = async (doctorId: string, receiverProfileImage: string, receiverName: string) => {
        const profilePicture = sessionStorage.getItem('profilePicture');
        const userId = sessionStorage.getItem('_id') || '';
        const username = sessionStorage.getItem('username') || '';

        try {
            const response = await fetch('/api/contacts/addContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    contactId: doctorId,
                    userProfileImage: profilePicture,
                    name: username,
                    receiverProfileImage,
                    receiverName,
                }),
            });

            if (response.ok) {
                console.log('Contact added successfully');
                router.push('/chat'); // Navigate to the chat page
            } else {
                const errorData = await response.json();
                console.error('Failed to add contact:', errorData.message);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    // Filter logic for appointments
    const filteredAppointments = appointments.filter((appointment) => {
        const matchName = appointment.name && appointment.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory ? appointment.appointmentType === selectedCategory : true;
        return matchName && matchCategory;
    });

    // Filter logic for doctors
    const filteredDoctors = doctors.filter((doctor) => {
        const matchName = doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory ? doctor.specialization === selectedCategory : true;
        return matchName && matchCategory;
    });

    // Pagination logic for appointments
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    // Pagination logic for doctors
    const indexOfLastDoctor = currentPage * appointmentsPerPage; // Change this if you want different pagination for doctors
    const indexOfFirstDoctor = indexOfLastDoctor - appointmentsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    return (
        <div className="container mt-5">
            <Navbar activeItem={1} />
            <SectionHeadings text={'Appointments'} color='#062635' align='flex-content-start' />
            <div className="input-group mb-3 my-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="form-select"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">All Categories</option>
                    <option value="Quick Checkup">Quick Checkup</option>
                    <option value="Extensive Care">Extensive Care</option>
                    <option value="Operation">Operation</option>
                    {/* Add more categories as needed */}
                </select>
            </div>

            <div className="row">
                {sessionStorage.getItem('role') === 'doctor' ? (
                    currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment, i) => (
                            <div className="col-md-4 mb-4" key={i}>
                                <AppointmentCard
                                    img={appointment.imageUrl || ''}
                                    name={appointment.name}
                                    specialization={appointment.specialization || ''} // Make sure this exists in your appointment object
                                    id={appointment.doctorId}
                                    time={new Date(appointment.appointmentTime).toLocaleString()} // Use toLocaleString for date & time
                                    appointmentType={appointment.appointmentType}
                                    handleComment={handleAddContact}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p>No appointments available.</p>
                        </div>
                    )
                ) : (
                 <HomepageFeaturedDoctorsSection/>
                )}
            </div>

            {/* Pagination controls */}
            <div className="pagination justify-content-center mt-4">
                {sessionStorage.getItem('role') === 'doctor' ? (
                    Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn btn-outline-primary mx-1 ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))
                ) : (
                    Array.from({ length: Math.ceil(filteredDoctors.length / appointmentsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn btn-outline-primary mx-1 ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;

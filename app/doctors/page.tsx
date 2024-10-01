'use client'; // Ensures the component is client-side

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DoctorsCard } from '@/components/doctorsCard';
import { IAppointment } from '@/model/AppointmentModal';
import { SectionHeadings } from '@/components/sectionHeadings';
import Navbar from '@/components/navbar';
import { IDoctor } from '@/model/doctorModal';
import { AppointmentCard } from '@/components/meetings';
import { useRouter } from 'next/navigation';
import './style.scss'
const Appointments = () => {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [specializations, setSpecializations] = useState<string[]>([]); // Specializations state
    const [selectSpecialization, setSelectedSpecialization] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const role = sessionStorage.getItem('role');
            const id = sessionStorage.getItem('_id');
            try {
                if (role === 'doctor') {
                    const response = await axios.get(`/api/appointments/getAllDoctorsById?id=${id}`);
                    if (response.data.success) {
                        setAppointments(response.data.appointments);
                    } else {
                        console.error('Error fetching appointments:', response.data.message);
                    }
                } else {
                    fetchFeaturedDoctors();
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Fetching featured doctors
    const fetchFeaturedDoctors = async () => {
        try {
            const response = await axios.get('/api/doctors/getAll');
            const doctors = response.data;
            setSpecializations(Array.from(new Set(doctors.map((doctor: IDoctor) => doctor.specialty))));
            setDoctors(doctors);
        } catch (error) {
            console.error('Error fetching featured doctors:', error);
        }
    };

    // Function to add a contact
    const handleAddContact = async (doctorId: string, receiverProfileImage: string, receiverName: string) => {
        const profilePicture = sessionStorage.getItem('profilePicture') || '';
        const userId = sessionStorage.getItem('_id') || '';
        const username = sessionStorage.getItem('username') || '';
        try {
            const response = await fetch('/api/contacts/addContact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                router.push('/chat');
            } else {
                const errorData = await response.json();
                console.error('Failed to add contact:', errorData.message);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    // Filter logic for appointments and doctors
    const filteredAppointments = appointments.filter(appointment => {
        const matchName = appointment.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory ? appointment.appointmentType === selectedCategory : true;
        return matchName && matchCategory;
    });

    const filteredDoctors = doctors.filter(doctor => {
        const matchName = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSpecialization = selectSpecialization ? doctor.specialty === selectSpecialization : true;
        return matchName && matchSpecialization;
    });

    // Pagination logic for appointments and doctors
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const indexOfLastDoctor = currentPage * appointmentsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - appointmentsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    return (
        <div className="container mt-5 pt-5">
            <Navbar activeItem={1} />
            {sessionStorage.getItem('role') == 'doctor' && (
                <div className="mt-5 pt-5">
                    <SectionHeadings text="Appointments" color="#062635" align="flex-content-start" />
                    <div className="input-group mb-3">
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
                        </select>
                    </div>
                </div>
            )}
            <div className="row">
                {sessionStorage.getItem('role') === 'doctor' ? (
                    currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment, i) => (
                            <div className="col-md-4 mb-4" key={i}>
                                <AppointmentCard
                                    img={appointment.imageUrl || ''}
                                    name={appointment.name}
                                    specialization={appointment.specialization || ''}
                                    id={appointment.doctorId}
                                    time={new Date(appointment.appointmentTime).toLocaleString()}
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
                  <></>
                )}
                {(!sessionStorage.getItem('role') || sessionStorage.getItem('role') === 'patient') && (
                    <div className="mt-5 py-1">
                        <SectionHeadings text="Doctors" align="flex-content-start" color="#062635" />
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="form-select"
                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                                value={selectSpecialization}
                            >
                                <option value="">All Specializations</option>
                                {specializations.map((specialization, index) => (
                                    <option key={index} value={specialization}>
                                        {specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center">
                            {currentDoctors.map((doctor, i) => (
                                <div key={i}>
                                    <DoctorsCard
                                        profileImage={doctor.profileImage}
                                        name={doctor.name}
                                        specialization={doctor.specialty}
                                        id={doctor.doctorId}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="pagination justify-content-center mt-4">
                {sessionStorage.getItem('role') === 'doctor' ? (
                    Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn m-1 pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))
                ) : (
                    Array.from({ length: Math.ceil(filteredDoctors.length / appointmentsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn m-1 pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
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

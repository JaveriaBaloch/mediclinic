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
import './style.scss';

interface Appointment {
    appointmentTime: string;
    img: string;
    name: string;
    specialization: string;
    time: string;
    imageUrl: string;
    patientId: string;
    appointmentType: string;
    _id: string;
    date: Date;
  }
const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const appointmentsPerPage = 10;
    const router = useRouter();

    const handleCancel = async (id: string) => {
        try {
            const response = await fetch(`/api/appointments/cancel?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAppointments(prev => prev.filter(appointment => appointment._id !== id));
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            const role = sessionStorage.getItem('role');
            const id = sessionStorage.getItem('_id');
            try {
                if (role === 'doctor' && id) {
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

    const fetchFeaturedDoctors = async () => {
        try {
            const response = await axios.get('/api/doctors/getAll');
            const doctorsData: IDoctor[] = response.data;
            setSpecializations(Array.from(new Set(doctorsData.map(doctor => doctor.specialty))));
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error fetching featured doctors:', error);
        }
    };
    

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

    const filteredAppointments = appointments.filter(appointment => {
        const matchName = appointment.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory ? appointment.appointmentType === selectedCategory : true;
        return matchName && matchCategory;
    });

    const filteredDoctors = doctors.filter(doctor => {
        const matchName = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSpecialization = selectedSpecialization ? doctor.specialty === selectedSpecialization : true;
        return matchName && matchSpecialization;
    });

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const indexOfLastDoctor = currentPage * appointmentsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - appointmentsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    return (
        <div className="container mt-5 pt-5">
            <Navbar activeItem={1} />
            {sessionStorage.getItem('role') === 'doctor' && (
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
                        currentAppointments.map((appointment,i) => (
                            <div className="col-md-4 mb-4" key={i}>
                                <AppointmentCard
                                    img={appointment.imageUrl || ''}
                                    name={appointment.name}
                                    specialization={appointment.specialization || ''}
                                    id={appointment._id}
                                    time={new Date(appointment.appointmentTime).toLocaleString()}
                                    appointmentType={appointment.appointmentType}
                                    handleComment={handleAddContact}
                                    handleCancel={handleCancel} // Pass handleCancel directly
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
                        <h4 className="small-heading">Doctors</h4>
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
                                value={selectedSpecialization}
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
                            {currentDoctors.map((doctor) => (
                                <div key={doctor.doctorId}>
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
                {sessionStorage.getItem('role') === 'doctor' && (
                    Array.from({ length: Math.ceil(filteredAppointments.length / appointmentsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
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

'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import './style.scss';
import { FooterSection } from '@/components/Footer';
import { AppointmentCard } from '@/components/meetings';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Appointment {
  appointmentTime: string;
  doctorId:string;
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

const SchedulePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State for storing appointments
  const userId = sessionStorage.getItem('_id'); // Retrieve user ID from sessionStorage
  const role = sessionStorage.getItem('role'); // Retrieve user role (either 'doctor' or 'patient')
  const router = useRouter()
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
    const fetchAppointments = async () => {
      try {
        let response;

        if (role === 'doctor') {
          // Fetch appointments by doctor ID
          response = await axios.get(`/api/appointments/getAllDoctorsById?id=${userId}`);
        } else if (role === 'patient') {
          // Fetch appointments by patient ID
          response = await axios.get(`/api/appointments/getAllPatientsById?id=${userId}`);
        }
        console.log(response?.data.appointments)
        if (response && response.data) {
          setAppointments(response.data.appointments);
        } else {
          console.error('No appointments found or invalid response');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [userId, role]);
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

  return (
    <div>
      <Navbar activeItem={3} />
      <div className="container">
        <div className="mt-5 holder-calender">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentCard
                img={appointment.imageUrl}
                name={appointment.name}
                time={new Date(appointment.appointmentTime).toLocaleString()}
                appointmentType={appointment.appointmentType}
                id={appointment._id}
                specialization={appointment.specialization}
                handleComment={()=>handleAddContact(appointment.doctorId,appointment.imageUrl,appointment.name)}
                handleCancel={handleCancel}
              />
            ))
          ) : (
            <p>No appointments available.</p> // Message when no appointments are found
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default SchedulePage;

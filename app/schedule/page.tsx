'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import './style.scss';
import { FooterSection } from '@/components/Footer';
import { AppointmentCard } from '@/components/meetings';
import axios from 'axios'; // Make sure to import axios

interface Appointment {
  appointmentTime: string;
  img: string;
  name: string;
  specialization: string;
  time: string;
  imageUrl: string;
  patientId: string;
  appointmentType: string;
  id: string;
  date: Date; // Include date for sorting
}
const SchedulePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to store appointments with the defined interface
  const doctorId = sessionStorage.getItem('_id'); // Replace this with the actual doctor ID you want to fetch appointments for

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/appointments/getAllDoctorsById?id=${doctorId}`); // Update the endpoint as necessary
        setAppointments(response.data); // Set appointments based on fetched data
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorId]); // Fetch appointments whenever doctorId changes

  return (
    <div>
      <Navbar activeItem={3} />
      <div className="container">
        <div className='mt-5 holder-calender'>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id} // Use the unique ID from the appointment object
                img={appointment.imageUrl} // Assuming the image URL is in img
                name={appointment.name}
                specialization={'appointment.specialization'}
                time={appointment.appointmentTime}
                id={appointment.id} // Assuming id is the unique identifier
                appointmentType={appointment.appointmentType} // Assuming appointmentType is part of the appointment object
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

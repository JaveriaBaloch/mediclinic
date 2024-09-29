'use client'
import Navbar from '@/components/navbar';
import PatientProfile from '@/components/patientprofile';
import React from 'react';
import './style.scss'
import DoctorProfile from '@/components/doctorProfile';
const HomePage: React.FC = () => {
  return (
    <div>
    <Navbar activeItem={-1} />
    <div className="mt-5 py-5">
        {sessionStorage.getItem('role')==='patient' &&
             <PatientProfile />
        }
       
        {sessionStorage.getItem('role')==='doctor' &&
        <DoctorProfile/>}
    </div>
      <button className='btn btn-lg text-white outline-none border-0 logout-btn'>Logout</button>
    </div>
  );
};

export default HomePage;

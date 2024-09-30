'use client'
import Navbar from '@/components/navbar';
import PatientProfile from '@/components/patientprofile';
import React from 'react';
import './style.scss'
import DoctorProfile from '@/components/doctorProfile';
import { useRouter } from 'next/navigation';
const HomePage: React.FC = () => {
    const router = useRouter()
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
      <button className='btn btn-lg text-white outline-none border-0 logout-btn'
      onClick={()=>{
        sessionStorage.removeItem("_id");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("profilePicture");
        sessionStorage.removeItem("email")
        sessionStorage.removeItem("role");
        router.push('/')
      }}
      >Logout</button>
    </div>
  );
};

export default HomePage;

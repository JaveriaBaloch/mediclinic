'use client'
import Navbar from '@/components/navbar';
import PatientProfile from '@/components/patientprofile';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
    <Navbar activeItem={-1} />
    <div className="mt-5 py-5">
    <PatientProfile />
    </div>
      
    </div>
  );
};

export default HomePage;

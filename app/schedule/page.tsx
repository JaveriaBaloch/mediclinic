'use client';

import Navbar from '@/components/navbar';
import './style.scss';
import { FooterSection } from '@/components/Footer';
import { AppointmentCard } from '@/components/meetings';

const SchedulePage = () => {
  const appointments = [
    {
      img: '/home/image.png',
      name: 'Rayad Tref',
      specialization: 'Endocrinologist',
      time: '10:00',
      id: '1',
    },
    {
      img: '/home/image.png',
      name: 'Sarah Lee',
      specialization: 'Cardiologist',
      time: '11:30',
      id: '2',
    },
    {
      img: '/home/image.png',
      name: 'John Smith',
      specialization: 'Neurologist',
      time: '12:45',
      id: '3',
    },
    {
      img: '/home/image.png',
      name: 'Linda White',
      specialization: 'Pediatrician',
      time: '14:00',
      id: '4',
    },
  ];

  return (
    <div>
      <Navbar activeItem={3} />
      <div className="container">
      <div className='mt-5 holder-calender '>
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            img={appointment.img}
            name={appointment.name}
            specialization={appointment.specialization}
            time={appointment.time}
            id={appointment.id}
          />
        ))}
      </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default SchedulePage;

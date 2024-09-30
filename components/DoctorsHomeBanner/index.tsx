import { useState } from "react";
import { DateRange, RangeKeyDict } from 'react-date-range';
import { AppointmentCard } from "../meetings"; // Ensure this component is correctly defined
import { SectionHeadings } from "../sectionHeadings"; // Ensure this component exists
import './style.scss';

// Define the type for appointments
interface Appointment {
    img: string;
    name: string;
    specialization: string;
    time: string;
    id: string;
}

export const DoctorsHomeBanner = () => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const appointments: Appointment[] = [
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

    const handleSelect = (ranges: any) => {
        setRange([ranges.selection]);
    };

    return (
        <div className="container" id="DoctorsSchedule">
            <SectionHeadings color="#006AAC" text="Appointments" align="justify-content-center" />
            <div className="row my-5">
                <div className="col-12 mx-auto my-5">
                    <h2>Today's Appointments</h2>
                    <div className="d-flex justify-content-center align-items-center flex-wrap">
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

                <div className="col-12 mx-auto my-5 d-flex flex-wrap justify-content-between">
                    <div className="col">
                    <h2>I am not available from {range[0].startDate?.toLocaleDateString()} to {range[0].endDate?.toLocaleDateString()}</h2>
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                    />
                    </div>
                    <p id="note">
                        Note: Your all previous called patients are in messages, please visit messages tab
                    </p>
                </div>
            </div>
        </div>
    );
};

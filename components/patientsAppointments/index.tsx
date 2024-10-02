import { useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from 'react-date-range';
import { AppointmentCard } from "../meetings"; // Ensure this component is correctly defined
import { SectionHeadings } from "../sectionHeadings"; // Ensure this component exists
import './style.scss';
import { useRouter } from "next/navigation";

interface Appointment {
    
    img: string;
    name: string;
    specialization: string;
    time: string;
    patientId: string;
    appointmentType: string;
    id: string;
    date: Date; // Include date for sorting
}

export const PatientsListView = () => {
    const router = useRouter()
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const id = sessionStorage.getItem('_id'); // Ensure _id exists in sessionStorage
    const handleComment = async (doctorId: string, receiverProfileImage: string, receiverName: string) => {
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
    
    // Fetch appointments by patient ID
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`/api/appointments/getAllPatientsById?id=${id}`); // Adjust endpoint accordingly
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            const fetchedAppointments: Appointment[] = data.appointments.map((appointment: any) => ({
                img: appointment.imageUrl || '/default-image.png', // Use default image if not available
                name: appointment.name || 'Unknown',
                specialization: appointment.specialization || 'General',
                time: new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                patientId: appointment.patientId,
                id: appointment._id,
                appointmentType: appointment.appointmentType,
                date: new Date(appointment.date) // Add date for sorting
            }));

            setAppointments(fetchedAppointments);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(); // Fetch appointments on component mount
    }, []);

    const handleSelect = (ranges: any) => {
        setRange([ranges.selection]);
    };

    // Sort appointments in descending order by date
    const sortedAppointments = appointments.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Group appointments by date
    const groupedAppointments = sortedAppointments.reduce((acc: { [key: string]: Appointment[] }, appointment) => {
        const dateKey = appointment.date.toLocaleDateString(); // Create a date key
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(appointment);
        return acc;
    }, {});
    const handleCancel = async (id: string) => {
        try {
            const response = await fetch(`/api/appointments/cancel?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAppointments(prev => prev.filter((appointment:any) => appointment._id !== id));
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };
    return (
        <div className="container" id="DoctorsSchedule">
            <SectionHeadings color="#006AAC" text="Appointments" align="justify-content-center" />
            <div className="row my-5">
                <div className="col-12 mx-auto my-5">
                    <h2>All Appointments</h2>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                            {Object.entries(groupedAppointments).length > 0 ? (
                                Object.entries(groupedAppointments).map(([date, appointments]) => (
                                    <div key={date} className="date-group">
                                        <small className="text-left ">{date}</small>
                                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                                            {appointments.map((appointment) => (
                                                <AppointmentCard
                                                    key={appointment.id}
                                                    img={appointment.img}
                                                    name={appointment.name}
                                                    specialization={appointment.specialization}
                                                    time={appointment.time}
                                                    id={appointment.patientId}
                                                    appointmentType={appointment.appointmentType}
                                                    handleComment={handleComment}
                                                    handleCancel={handleCancel}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No appointments available.</p>
                            )}
                        </div>
                    )}
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

import { useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from 'react-date-range';
import { AppointmentCard } from "../meetings"; // Ensure this component is correctly defined
import { SectionHeadings } from "../sectionHeadings"; // Ensure this component exists
import './style.scss';
import { useRouter } from "next/navigation";

// Define the type for appointments
interface Appointment {
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

export const DoctorsHomeBanner = () => {
    const router = useRouter()
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState<string | null>(null); // To handle errors

    // Fetch appointments from the API
    const fetchAppointments = async () => {
        const doctorId = sessionStorage.getItem('_id'); // Get the doctor ID from sessionStorage

        try {
            // Include the doctor ID in the request URL
            const response = await fetch(`/api/appointments/getAllDoctorsById?id=${doctorId}`); 
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            // Transform data to match your Appointment type if necessary
            const fetchedAppointments: Appointment[] = data.appointments.map((appointment: any) => ({
                img: appointment.imageUrl, // Use a default image or customize based on your data
                name: appointment.name, // Ensure the API returns the necessary fields
                specialization: 'Specialization', // You might need to map this accordingly
                time: new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                patientId: appointment.patientId,
                id: appointment._id,
                appointmentType: appointment.appointmentType,
                date: new Date(appointment.date) // Add the date to the Appointment object for sorting
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

    const handleSelect = (ranges: RangeKeyDict) => {
        setRange([ranges.selection]);
    };

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time to the start of the day

    // Filter appointments for today
    const todayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0); // Reset the time to compare only dates
        return appointmentDate.getTime() === today.getTime();
    });

    // Sort appointments in descending order by date
    const sortedTodayAppointments = todayAppointments.sort((a, b) => a.date.getTime()- b.date.getTime());
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
    
    return (
        <div className="container" id="DoctorsSchedule">
            <SectionHeadings color="#006AAC" text="Appointments" align="justify-content-center" />
            <div className="row my-5">
                <div className="col-12 mx-auto my-5">
                    <h2>Today's Appointments</h2>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                            {sortedTodayAppointments.length > 0 ? (
                                sortedTodayAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        img={appointment.img}
                                        name={appointment.name}
                                        specialization={appointment.specialization}
                                        time={appointment.time}
                                        id={appointment.patientId}
                                        appointmentType={appointment.appointmentType}
                                        handleComment={handleComment}
                                    />
                                ))
                            ) : (
                                <p>No appointments for today.</p>
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

'use client';
import { useEffect, useState } from "react";
import { DateRange, RangeKeyDict } from 'react-date-range';
import { AppointmentCard } from "../meetings"; // Ensure this component is correctly defined
import { SectionHeadings } from "../sectionHeadings"; // Ensure this component exists
import './style.scss';
import { useRouter } from "next/navigation";
import Modal from 'react-modal'; // Import Modal from a library

interface Availability {
    _id: string;
    doctorId: string;
    startDate: Date;
    endDate: Date;
}

interface Range {
    _id: string;
    startDate: Date; 
    endDate: Date; 
    key: string; 
}

interface Appointment {
    _id: string;
    img: string;
    name: string;
    specialization: string;
    time: string;
    patientId: string;
    appointmentType: string;
    date: Date; // Include date for sorting
}

export const DoctorsHomeBanner = () => {
    const router = useRouter();
    const [range, setRange] = useState<Range[]>([]); // Holds multiple ranges
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
    const [selectedRange, setSelectedRange] = useState<RangeKeyDict>({
        selection: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    }); // Default range for the modal

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

    const fetchAppointments = async () => {
        const doctorId = sessionStorage.getItem('_id');

        try {
            const response = await fetch(`/api/appointments/getAllDoctorsById?id=${doctorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            const fetchedAppointments: Appointment[] = data.appointments.map((appointment: any) => ({
                img: appointment.imageUrl,
                name: appointment.name,
                specialization: 'Specialization',
                time: new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                patientId: appointment.patientId,
                _id: appointment._id, // Change 'id' to '_id'
                appointmentType: appointment.appointmentType,
                date: new Date(appointment.date),
            }));

            setAppointments(fetchedAppointments);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailabilities = async () => {
        const doctorId = sessionStorage.getItem('_id');
    
        try {
            const response = await fetch(`/api/availabilities/getByDoctorId?doctorId=${doctorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch availabilities');
            }
            const data: Availability[] = await response.json();
            setAvailabilities(data);
    
            // Map to include all required properties
            const dateRanges = data.map(avail => ({
                _id: avail._id,  // Include _id
                doctorId: avail.doctorId,  // Include doctorId
                startDate: new Date(avail.startDate),
                endDate: new Date(avail.endDate),
                key: `selection-${avail._id}`,
            }));
    
            setRange(dateRanges);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAppointments();
        fetchAvailabilities();
    }, []);
    
    const handleOpenModal = () => {
        setModalIsOpen(true); // Open modal on click
    };

    const handleSelect = (ranges: RangeKeyDict) => {
        setSelectedRange(ranges); // Update selected range
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const doctorId = sessionStorage.getItem('_id');
    
        // Ensure selectedRange is set correctly
        console.log('Selected Range:', selectedRange);
    
        const ranges = [{ startDate: selectedRange.selection.startDate, endDate: selectedRange.selection.endDate }];
    
        try {
            const response = await fetch('/api/availabilities/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doctorId, ranges }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setMessage('Availability updated successfully!');
                fetchAvailabilities(); // Refresh availabilities
                setModalIsOpen(false); // Close the modal after successful submission
            } else {
                setMessage(data.message || 'Failed to update availability.');
            }
        } catch (error) {
            console.error('Error updating availability:', error);
            setMessage('An error occurred. Please try again.');
        }
    };
    const handleCancelAvailability = async (id: string) => {
        try {
            const response = await fetch(`/api/availabilities/delete?id=${id}`, {
                method: 'DELETE', // Fixing the method placement
            });
            
            if (response.ok) {
                setRange(prev => prev.filter(avail => avail._id !== id));
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel availability:', errorData.message);
            }
        } catch (error) {
            console.error('Failed to cancel availability:', error);
        }
    };
    

    
    const handleDateChange = (ranges:any) => {
        // Check if the ranges are defined and have the expected structure
        if (ranges.selection) {
            setRange([ranges.selection]); // Update state with the selected range
        }
    };

    const handleCancelAppointment = async (id: string) => {
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

    return (
        <div className="container" id="DoctorsSchedule">
            <SectionHeadings color="#006AAC" text="Appointments" align="justify-content-center" />
            <div className="row my-5">
                <div className="col-12 mx-auto my-5">
                    <h2>Today's Appointments</h2>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : error ? (
                        <p className="text-center mt-5">No Appointments for today</p>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                            {appointments.length > 0 ? (
                                appointments.map((appointment, i) => (
                                    <AppointmentCard
                                        key={i}
                                        img={appointment.img}
                                        name={appointment.name}
                                        specialization={appointment.specialization}
                                        time={appointment.time}
                                        id={appointment.patientId}
                                        appointmentType={appointment.appointmentType}
                                        handleComment={handleComment}
                                        handleCancel={() => handleCancelAppointment(appointment._id)}
                                    />
                                ))
                            ) : (
                                <p>No appointments for today.</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-8 col-lg-4 col-xl-4 mx-auto my-5 d-flex flex-wrap justify-content-between">
                        <div className="col">
                            <h2>Click on the calander add Unavailability</h2>
                            {/* Clickable div around DateRange to show the modal */}
                            <div onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                            <DateRange
            editableDateInputs={true} // Allow editing of dates
            onChange={handleDateChange} // Handle date selection
            moveRangeOnFirstSelection={false} // Prevent moving the range on first selection
            ranges={range}
        />

                            </div>
                            {message && <p className="text-success">{message}</p>}
                        </div>
                    </div>
                    <div className="delete-availabilities col-sm-12 col-md-8 col-lg-7 col-xl-7 my-5 ms-lg-auto ms-xl-auto ms-md-0 mx-md-auto">
                        <h2>Scheduled Unavailability</h2>
                        <div className="list-group">
                            {
                                range.map((e, i) => (
                                    <div key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{`From: ${e.startDate.toLocaleDateString()} To: ${e.endDate.toLocaleDateString()}`}</span>
                                        <button className="btn btn-danger" onClick={() => handleCancelAvailability(e._id)}>Cancel</button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for date range selection */}
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className={'opacity-30'}>
                
                <div className="form-update-availability mx-auto">
                    <div className="col">
                    <h2 className="w-100">Select Date Range</h2>
                    </div>
                   
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={[selectedRange.selection]}
                    />
                    <div className="block d-flex justify-content-between align-items-center">
                    <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
                    <button className="btn btn-secondary"  onClick={() => setModalIsOpen(false)}>Close</button>
                    </div>
                    </div>
                </Modal>
        </div>
    );
};

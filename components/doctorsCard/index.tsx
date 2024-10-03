import React, { useState } from "react";
import './style.scss';
import Link from "next/link";
import { AppointmentModal } from "../appointmentModal"; // Ensure you import the modal component
import { useRouter } from "next/navigation";

interface DoctorsCardProps {
    profileImage: string;
    name: string;
    specialization: string;
    id: number | string;
}

export const DoctorsCard: React.FC<DoctorsCardProps> = ({
    profileImage,
    name,
    specialization,
    id
}) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleBookAppointmentClick = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Use encodeURI to properly encode the profile image URL
    const encodedUrl = encodeURI(profileImage);
    console.log(encodedUrl)
    return (
        <div className="doctor-card">
            <img src={encodedUrl} alt={name} className="img" />
            <h4>{name}</h4>
            <small>{specialization}</small>
            <button
                className="btn btn-success"
                onClick={() => {
                    if (sessionStorage.getItem('_id')) {
                        handleBookAppointmentClick();
                    } else {
                        router.push('/authentication');
                    }
                }}
            >
                Book Appointment
            </button>

            {isModalOpen && (
                <AppointmentModal
                    doctorImage={profileImage}
                    doctorId={id}
                    doctorName={name}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

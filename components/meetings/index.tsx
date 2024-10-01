// AppointmentCard.tsx
'use client'; // Ensures the component is client-side
import React from "react";
import Link from "next/link";
import { Icon } from "../icons/icon";
import { faComment, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import trash icon for cancellation
import './style.scss';

// Define the props interface for AppointmentCard
interface AppointmentCardProps {
  img: string;
  name: string;
  time: string;
  id: string; // Ensure this is a string for routing or identification
  specialization: string;
  appointmentType: string;
  handleComment: (doctorId: string, receiverProfileImage: string, receiverName: string) => void; // Add the handleComment prop
  handleCancel: (appointmentId: string) => void; // Add handleCancel prop
}

// Define the AppointmentCard component
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  img,
  name,
  specialization,
  id,
  time,
  appointmentType,
  handleComment,
  handleCancel,
}) => {
  // Get profile picture and username from sessionStorage
  const profilePicture = sessionStorage.getItem('profilePicture') || '';
  const username = sessionStorage.getItem('username') || '';

  return (
    <div className="doctor-card appointment-card">
      <img src={img} alt={name} className="img" />
      <h4>{name}</h4>
      <small>{specialization}</small>
      <p>{time}</p> {/* Display the appointment time */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          className="icon-holder mx-2 border-0"
          onClick={(e) => {
            e.preventDefault();
            handleComment(id, profilePicture, username); // Call handleComment with appropriate parameters
          }}
        >
          <Icon color="#006AAC" icon={faComment} size="xl" />
        </button>
        <button
          className="icon-holder mx-2 border-0"
          onClick={(e) => {
            e.preventDefault();
            handleCancel(id); // Directly call handleCancel with appointment id
          }}
        >
          <Icon color="#D9534F" icon={faTrash} size="xl" /> {/* Trash icon for cancellation */}
        </button>
      </div>
    </div>
  );
};

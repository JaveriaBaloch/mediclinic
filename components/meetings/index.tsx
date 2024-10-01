import Link from "next/link";
import React from "react";
import { Icon } from "../icons/icon";
import { faComment, faPhone } from "@fortawesome/free-solid-svg-icons";
import './style.scss';

interface AppointmentCardProps {
  img: string;
  name: string;
  time: string;
  id: string; // Used for routing or identification
  specialization: string;
  appointmentType: string;
  handleComment: (doctorId: string, receiverProfileImage: string, receiverName: string) => void; // Add the handleComment prop
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ img, name, specialization, id, time, appointmentType, handleComment }) => {
  const profilePicture = sessionStorage.getItem('profilePicture');
  const username = sessionStorage.getItem('username') || '';

  return (
    <div className="doctor-card appointment-card">
      <img src={img} alt={name} className="img" />
      <h4>{name}</h4>
      <small>{specialization}</small>
      <p>{time}</p> {/* Display the appointment time */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button className="icon-holder mx-2 border-0" onClick={(e) => { e.preventDefault(); handleComment(id, img, name); }}>
          <Icon color="#006AAC" icon={faComment} size="xl" />
        </button>
      </div>
    </div>
  );
};

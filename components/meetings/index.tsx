import Link from "next/link";
import React from "react";
import { Icon } from "../icons/icon";
import { faComment, faPhone } from "@fortawesome/free-solid-svg-icons";
import './style.scss'
interface AppointmentCardProps {
  img: string;
  name: string;
  time: string;
  id: string; // You can use this for routing or identification
  specialization: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ img, name, specialization, id, time }) => {
  return (
    <div className="doctor-card appointment-card">
      <img src={img} alt={name} className="img" />
      <h4>{name}</h4>
      <small>{specialization}</small>
      <p>{time}</p> {/* Display the appointment time */}
      <div className="d-flex justify-content-center align-items-center mt-3">
      <Link href={'/chat/'+id} className="icon-holder mx-2">
            <Icon color="#006AAC" icon={faComment} size="xl" />
      </Link>
      <Link href={'/chat/'+id} className="icon-holder mx-2">
            <Icon color="#006AAC" icon={faPhone} size="xl" />
      </Link>
    </div>
    </div>
  );
};

import React from "react"
import './style.scss'
import Link from "next/link"
interface DoctorsCardProps {
    img:string,
    name:string,
    specialization:string,
    id:number
}

export const DoctorsCard:React.FC<DoctorsCardProps> = ({img,name,specialization,id})=>{
    return(
        <div className=" doctor-card ">
            <img src={img} className="img"/>
            <h4>{name}</h4>
            <small>{specialization}</small>
            <Link href={'/'}>Book Appointment</Link>
        </div>
    )
}
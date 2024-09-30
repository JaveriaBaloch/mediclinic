'use client'; // This directive makes the component a client component

import { IDoctor } from "@/model/doctorModal";
import { useEffect, useState } from "react";
import './style.scss';
import { Icon } from "@/components/icons/icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"; // Use for navigation

export const AdminHomePageView = () => {
  const [doctorsList, setDoctorsList] = useState<IDoctor[]>([]);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctorsList(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleApprove = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/doctors/approve?doctorId=${doctorId}`, {
        method: 'POST',
      });
      if (response.ok) {
        setDoctorsList((prev) => prev.map((doctor) => 
          doctor.doctorId === doctorId ? { ...doctor, status: 'accepted' } : doctor
        ));
      } else {
        console.error('Failed to approve doctor');
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleDisapprove = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/doctors/disapprove?doctorId=${doctorId}`, {
        method: 'POST',
      });
      if (response.ok) {
        setDoctorsList((prev) => prev.map((doctor) => 
          doctor.doctorId === doctorId ? { ...doctor, status: 'rejected' } : doctor
        ));
      } else {
        console.error('Failed to disapprove doctor');
      }
    } catch (error) {
      console.error('Error disapproving doctor:', error);
    }
  };

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
    <div id="adminview" className="mt-5">
      <div className="container my-5">
        <h4 className="small-heading">Doctors waiting for approval</h4>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          {doctorsList.map((doctor) => (
            <div key={doctor.doctorId} className="doctor-card-admin mt-3 m-2 d-flex flex-wrap justify-content-start align-items-start p-4">
              <div className="d-block p-2">
                <img src={doctor.profileImage} alt={doctor.name} className="doctor-image" />
                <h5>{doctor.name}</h5>
                <p className="specialization">{doctor.specialty}</p>
                <b className={`status ${doctor.status === 'pending' ? 'bg-warning' : ''} ${doctor.status === 'accepted' ? 'bg-success text-white' : ''} ${doctor.status === 'rejected' ? 'bg-danger text-white' : ''}`}>
                  Status: {doctor.status}
                </b>
              </div>
              <div className="d-block ms-5">
                <h4>Documents</h4>
                <ul className="list-group w-100">
                  {doctor.documents.map((document, index) => (
                    <li className="list-group-item w-100" key={index}>
                      <a href={document} target="_blank" rel="noopener noreferrer" className="w-100">
                        Document {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-100 h-100 d-flex justify-content-between align-items-center">
                <button className="btn ms-3 b-0 mt-auto btn-info" onClick={(e) => { e.preventDefault(); handleApprove(doctor.doctorId); }}>
                  Approve
                </button>
                <a className="icon-holder" onClick={(e) => { e.preventDefault(); handleComment(doctor.doctorId, doctor.profileImage, doctor.name); }}>
                  <Icon color="white" icon={faComment} size="2x" />
                </a>
                <button className="btn ms-3 b-0 mt-auto btn-danger" onClick={(e) => { e.preventDefault(); handleDisapprove(doctor.doctorId); }}>
                  Disapprove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { IDoctor } from "@/model/doctorModal";
import { useEffect, useState } from "react";

export const AdminHomePageView = () => {
  const [doctorsList, setDoctorsList] = useState<IDoctor[]>([]);

  useEffect(() => {
    // Fetch the doctors waiting for approval
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors/getProfile'); // Replace with your actual API endpoint
        const data = await response.json();
        setDoctorsList(data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div id="adminview" className="mt-5">
      <div className="container my-5">
        <h4>Doctors waiting for approval</h4>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          {doctorsList.map((doctor) => (
            <div key={doctor.doctorId} className="doctor-card">
              <img src={doctor.profileImage} alt={doctor.name} className="doctor-image" />
              <h5>{doctor.name}</h5>
              <p>Specialty: {doctor.specialty}</p>
              <p>Status: {doctor.status}</p>
              {/* Add more fields as necessary */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

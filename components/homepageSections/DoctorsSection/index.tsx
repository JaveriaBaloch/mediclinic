'use client'; // This directive makes the component a client component

import { useEffect, useState } from "react";
import { DoctorsCard } from "@/components/doctorsCard";
import { SectionHeadings } from "@/components/sectionHeadings";
import './style.scss';
import axios from 'axios';
import { IDoctor } from "@/model/doctorModal"; // Adjust the import path as necessary

export const HomepageFeaturedDoctorsSection = () => {
    const [featuredDoctors, setFeaturedDoctors] = useState<Array<IDoctor>>([]);

    useEffect(() => {
        const fetchFeaturedDoctors = async () => {
            try {
                const response = await axios.get('/api/doctors/getAll'); // Update the endpoint as necessary
                const doctors = response.data;

                // Assuming each doctor has a `date` field to sort by
                const sortedDoctors = doctors.sort((b: IDoctor, a: IDoctor) => {
                    // Replace `a.date` and `b.date` with the actual date field in your doctor object
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                setFeaturedDoctors(sortedDoctors);
            } catch (error) {
                console.error('Error fetching featured doctors:', error);
            }
        };

        fetchFeaturedDoctors();
    }, []);

    return (
        <div id="FeaturedDoctorsSection">
            <div className="container">
                <SectionHeadings color="#006AAC" text={"Featured Providers"} align="flex-start" />

                <div className="list d-flex flex-wrap justify-content-center align-items-center">
                    {featuredDoctors.length > 0 ? (
                        featuredDoctors.map((doctor) => (
                            <DoctorsCard
                                key={doctor.doctorId} // Use a unique ID from the doctor object
                                profileImage={doctor.profileImage} // Assuming the image URL is in profileImage
                                name={doctor.name}
                                specialization={doctor.specialty}
                                id={doctor.doctorId} // Assuming doctorId is the unique identifier
                            />
                        ))
                    ) : (
                        <p>No featured doctors available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

'use client';
import Navbar from "@/components/navbar";
import styles from "../page.module.css";
import { FooterSection } from "@/components/Footer";
import { useState } from "react";
import "@/components/doctorsCard/style.scss";
import Pagination from "@/components/pagination/pagination"; 
import doctorsData from "@/components/doctorList/listOfDoctors.json";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const doctorsPerPage = 12; 

  // Filterfunktion basierend auf Suchbegriff und Kategorie
  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchName = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? doctor.specialization === selectedCategory : true;
    return matchName && matchCategory;
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  return (
    <section id="Doctors"className="mt-5 pt-5">
      {/* Navbar wird ohne `cart`-Prop aufgerufen, da es nicht benötigt wird */}
      <Navbar activeItem={1} />  

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter by Specialization
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <button className="dropdown-item" onClick={() => setSelectedCategory('')}>
                    All Specializations
                  </button>
                </li>
                {/* Dynamisch generierte Kategorien */}
                {Array.from(new Set(doctorsData.map(doctor => doctor.specialization))).map((category, index) => (
                  <li key={index}>
                    <button className="dropdown-item" onClick={() => setSelectedCategory(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Anzeige der Treffer */}
        <div className="mt-3">
          <p>{filteredDoctors.length} of {doctorsData.length} doctors match "{searchTerm}"</p>
        </div>

        {/* Ergebnisliste */}
        <div className="row mt-4">
          {currentDoctors.map((doctor, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="doctor-card">
                <div className="img" style={{ backgroundImage: `url(${doctor.picture})` }}>
                </div>
                <h4>{doctor.name}</h4>
                <small>Specialization: {doctor.specialization}</small>
                <a href="#" className="btn">More Info</a>
              </div>
            </div>
          ))}
        </div>

        {/* Paginierung */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <FooterSection />
    </section>
  );
};

export default Doctors;

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './scss/navbar.scss';
import { Icon } from './icons/icon';
import { faCalendar, faCartPlus, faComments, faHome, faKitMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  activeItem: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem }) => {
  const [img, setImg] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setImg(sessionStorage.getItem("profilePicture"));
    setUsername(sessionStorage.getItem("username"));
    setRole(sessionStorage.getItem("role"));

    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js' as string);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-xl px-3 bg-white py-2">
      <div className="container-fluid pb-1 px-3">
        <Link href="/" className="navbar-brand">
          <Image src="/images/TestLogo.png" alt="Logo" width={130} height={50} className="logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto justify-content-center align-items-center">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${activeItem === 0 ? 'active' : ''}`}>
                <Icon icon={faHome} size="1x" color="#062635" />
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/doctors" className={`nav-link ${activeItem === 1 ? 'active' : ''}`} aria-current="page">
                <Icon icon={faStethoscope} size="1x" color="#062635" />
                <p>{role === 'doctor' ? 'Patients' : 'Doctors'}</p>
              </Link>
            </li>

            {role === 'patient' && (
              <li className="nav-item">
                <Link href="/schedule" className={`nav-link ${activeItem === 3 ? 'active' : ''}`} aria-current="page">
                  <Icon icon={faCalendar} size="1x" color="#062635" />
                  <p>Schedule</p>
                </Link>
              </li>
            )}
            {role !== null && (
              <li className="nav-item">
                <Link href="/chat" className={`nav-link ${activeItem === 4 ? 'active' : ''}`} aria-current="page">
                  <Icon icon={faComments} size="1x" color="#062635" />
                  <p>Message</p>
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav justify-content-center align-items-center">
            <li className="nav-item p-0 me-3">
              <Link href="/cart" className="nav-link p-0 ps-2">
                <div className="cart-icon-holder">
                  <Icon icon={faCartPlus} size="xl" color="#006AAC" />
                </div>
              </Link>
            </li>
            {role !== null && (
              <li className="nav-item p-0 me-3">
                <Link href="/profile" className="nav-link p-0 ps-2 d-flex justify-content-center align-items-center flex-column">
                  <img src={img ? img : ''} width={45} alt="" style={{ borderRadius: '50%' }} />
                  <b style={{
                    color: '#062635',
                    textAlign: 'center',
                    fontFamily: 'Manrope',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                  }}>{username}</b>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
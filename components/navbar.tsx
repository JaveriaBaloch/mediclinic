'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';  // Next.js optimized image component
import Link from 'next/link';    // Next.js link component for internal routing
import './scss/navbar.scss'; // Adjust path if necessary


const Navbar = () => {
  useEffect(() => {
    // Dynamically import Bootstrap JS on client side only
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js' as string);
    }
  }, []);
  return (
    <nav className="navbar navbar-expand-xl bg-white rounded-5 py-2">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          <Image src="/images/TestLogo.png" alt="Logo" width={130} height={50} className="logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* First Navigation Group */}
          <ul className="navbar-nav mx-auto justify-content-center align-items-center">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                <div className="img1"></div>
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/patients" className="nav-link active" aria-current="page">
                <div className="img2"></div>
                <p>Patients</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/schedule" className="nav-link">
                <div className="img3"></div>
                <p>Schedule</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/message" className="nav-link">
                <div className="img4"></div>
                <p>Message</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/transaction" className="nav-link">
                <div className="img5"></div>
                <p>Transaction</p>
              </Link>
            </li>
          </ul>

          {/* Second Navigation Group */}
          <ul className="navbar-nav justify-content-center align-items-center">
            <li className="nav-item border-end pe-2">
              <div className="d-flex justify-content-center align-items-center">
                <div className="doctor-image"></div>
                <div className="ms-2">
                  <h4 className="doctor-name">Dr Jose Simmons</h4>
                  <p className="doctor-title">General Practitioner</p>
                </div>
              </div>
            </li>
            <li className="nav-item p-0">
              <Link href="/settings" className="nav-link p-0 ps-2">
                <Image src="/images/settings_FILL0_wght300_GRAD0_opsz24.png" alt="Settings" width={24} height={24} />
              </Link>
            </li>
            <li className="nav-item p-0">
              <Link href="/more-options" className="nav-link p-0">
                <Image src="/images/more_vert_FILL0_wght300_GRAD0_opsz24.png" alt="More options" width={5} height={24}  className='d-xxl-block d-lg-none d-md-none d-sm-none d-xs-none ms-3' />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

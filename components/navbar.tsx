'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';  // Next.js optimized image component
import Link from 'next/link';    // Next.js link component for internal routing
import './scss/navbar.scss'; // Adjust path if necessary
import { Icon } from './icons/icon';
import { faCartPlus, faCartShopping, faHome, faKitMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {

  useEffect(() => {
    // Dynamically import Bootstrap JS on client side only
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
          {/* First Navigation Group */}
          <ul className="navbar-nav mx-auto justify-content-center align-items-center">
            <li className="nav-item">
              <Link href="/" className="nav-link active">
                <Icon icon={faHome} size="1x" color='#062635'/>
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/doctors" className="nav-link" aria-current="page">
              <Icon icon={faStethoscope} size="1x" color='#062635'/>
                <p>Doctors</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/pharmacy" className="nav-link">
                <Icon icon={faKitMedical} size="1x" color='#062635'/>
                <p>Pharmacy</p>
              </Link>
            </li>
          </ul>

          {/* Second Navigation Group */}
          <ul className="navbar-nav justify-content-center align-items-center">
            <li className="nav-item p-0 me-3">
              <Link href="/settings" className="nav-link p-0 ps-2">
                <div className="cart-icon-holder">
                <Icon icon={faCartPlus} size="xl" color='#006AAC'/>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

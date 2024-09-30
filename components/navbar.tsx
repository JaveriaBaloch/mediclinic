'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';  
import Link from 'next/link';   
import './scss/navbar.scss'; 
import { Icon } from './icons/icon';
import { faCartPlus, faHome, faKitMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';

// Typen für den Warenkorb definieren
interface Product {
  id: number;
  name: string;
  price: number;
  picture: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  [key: number]: CartItem;
}

interface NavbarProps {
  activeItem: number;
  cart?: Cart;  // Das `cart`-Prop ist optional
  removeFromCart?: (productId: number) => void; // Funktion zum Entfernen von Produkten optional machen
}

const Navbar: React.FC<NavbarProps> = ({ activeItem, cart, removeFromCart }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js' as string);
    }
  }, []);

  // Berechnung des Gesamtpreises
  const totalPrice = cart
    ? Object.values(cart).reduce((total, { quantity, product }) => {
        return total + quantity * product.price;
      }, 0)
    : 0;

  return (
    <nav className="navbar navbar-expand-xl px-3 bg-white py-2">
      <div className="container-fluid pb-1 px-3">
        <Link href="/" className="navbar-brand">
          <Image src="/images/TestLogo.png" alt="Logo" width={130} height={50} className="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto justify-content-center align-items-center">
            <li className="nav-item">
              <Link href="/" className={`${'nav-link '} ${activeItem == 0 ? 'active' : ''}`}>
                <Icon icon={faHome} size="1x" color="#062635" />
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/doctors" className={`${'nav-link '} ${activeItem == 1 ? 'active' : ''}`} aria-current="page">
                <Icon icon={faStethoscope} size="1x" color="#062635" />
                <p>Doctors</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/pharmacy" className={`${'nav-link '} ${activeItem == 2 ? 'active' : ''}`}>
                <Icon icon={faKitMedical} size="1x" color="#062635" />
                <p>Pharmacy</p>
              </Link>
            </li>
          </ul>

          {/* Dropdown-Menü für den Warenkorb */}
          <ul className="navbar-nav justify-content-center align-items-center">
            <li className="nav-item dropdown p-0 me-3">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="cartDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="cart-icon-holder">
                  <Icon icon={faCartPlus} size="xl" color="#006AAC" />
                </div>
              </a>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown">
                {Object.keys(cart || {}).length === 0 ? (
                  <li className="dropdown-item">Cart is empty</li>
                ) : (
                  <>
                    {Object.values(cart!).map(({ product, quantity }) => (
                      <li key={product.id} className="dropdown-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            {product.name} - {quantity} x ${product.price.toFixed(2)}
                          </span>
                          {/* Remove-Button im Dropdown-Menü */}
                          {removeFromCart && (
                            <button
                              className="btn btn-danger btn-sm ms-3"
                              onClick={() => removeFromCart(product.id)} 
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                    <li className="dropdown-divider"></li>
                    <li className="dropdown-item">
                      <strong>Total: ${totalPrice.toFixed(2)}</strong>
                    </li>
                    <li className="dropdown-item text-center">
                      <button className="btn btn-primary">Checkout</button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



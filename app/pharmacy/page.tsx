'use client';
import Navbar from "@/components/navbar";
import styles from "../page.module.css";
import { FooterSection } from "@/components/Footer";
import { useState } from "react";
import "@/components/pharmacyItem/pharmacy.module.scss"; // Styles für die Pharmacy-Seite
import Pagination from "@/components/pagination/pagination"; 
import pharmacyData from "@/components/pharmacyItem/listOfProducts.json"; // Importiere die Produktdaten

// Definiere Typen für Produkt und Warenkorb
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

const Pharmacy = () => {
  const [cart, setCart] = useState<Cart>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [searchTerm, setSearchTerm] = useState<string>(''); // Für die Suchleiste
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 10;

  // Filterprodukte nach Suchbegriff
  const filteredProducts = pharmacyData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funktion zur Mengensteuerung
  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 1) + change;
      return { ...prevQuantities, [productId]: Math.max(newQuantity, 1) };
    });
  };

  // Funktion zum Hinzufügen der ausgewählten Menge zum Warenkorb
  const handleBuy = (productId: number) => {
    const quantityToAdd = quantities[productId] || 1;
    setCart((prevCart: Cart) => {
      const existingItem = prevCart[productId];
      const updatedCart = {
        ...prevCart,
        [productId]: {
          product: pharmacyData.find((p) => p.id === productId)!,
          quantity: (existingItem ? existingItem.quantity : 0) + quantityToAdd, // Füge zur bestehenden Menge hinzu
        },
      };
      return updatedCart;
    });

    // Nach dem Kauf die Menge wieder auf 1 setzen
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: 1,
    }));
  };

  // Funktion zum Entfernen eines Produkts aus dem Warenkorb
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId]; // Entferne das Produkt aus dem Warenkorb
      return updatedCart;
    });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <section id="Pharmacy" className="pharmacySection">
      <Navbar activeItem={2} cart={cart} removeFromCart={removeFromCart} />  {/* Warenkorb und Remove-Funktion an Navbar übergeben */}

      {/* Suchleiste */}
      <div className="container mt-5">
        <div className="row mb-4">
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search by product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Produktliste */}
        <div className="row mt-4">
          {currentProducts.map((product, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card productCard">
                <img src={product.picture} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h4>{product.name}</h4>
                  <p>Price: ${product.price.toFixed(2)}</p>

                  {/* Mengensteuerung und Buy-Button in einer flexbox */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="quantity-control">
                      <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                      <span>{quantities[product.id] || 1}</span>
                      <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleBuy(product.id)}>
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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

export default Pharmacy;


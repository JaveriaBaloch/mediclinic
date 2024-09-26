import React from "react";
import './style.scss'
interface TestimonialCardInfo {
  img: string;
  name: string;
  text: string;
  rating: number;
}

export const TestimonialCard: React.FC<TestimonialCardInfo> = ({ img, name, text, rating }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={img} className="" alt={name} />
            <h5 className="card-title">{name}</h5>
          </div>
          <div className="col-md-8">
            <p className="card-text text">{text}</p>
            <div className="card-rating">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`star ${i < rating ? "filled" : ""} mx-2`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';
import React, { useState, useEffect } from 'react';
import './style.scss';

export const HomePageHealthTipSection = () => {
    const [activeTip, setActiveTip] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveTip((prev) => (prev === tips.length - 1 ? 0 : prev + 1)); // Cycle through contents
        }, 4000); // Change content every 4 seconds
        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [activeTip]);

    const tips = [
        {
            heading: "How to remain Healthy?",
            text: "Prioritize a balanced diet, including plenty of fruits, vegetables, whole grains, lean proteins, and low-fat dairy products...",
            image: "/home/healthtip1.png"
        },
        {
            heading: "Exercise Regularly",
            text: "Engage in physical activity for at least 30 minutes a day. This can be brisk walking, cycling, or any form of exercise...",
            image: "/home/healthtip2.png"
        },
        {
            heading: "Mental Health",
            text: "Take care of your mental health by managing stress, practicing mindfulness, and ensuring you have enough sleep...",
            image: "/home/healthtip3.png"
        }
    ];

    return (
        <div id="HealthTips">
            <div className="container my-5 pt-4">
                <div className="tips-holder">
                    <div className="tips-wrapper" style={{ transform: `translateX(-${activeTip * 100}%)` }}>
                        {tips.map((tip, index) => (
                            <div key={index} className="tip">
                                <div className="col-lg-6 col-md-12 d-flex flex-column justify-content-center mt-5">
                                    <div className="tip-text">
                                        <div className="tip-badge">
                                            <p>Health Tips</p>
                                        </div>
                                        <div className="tip-heading">
                                            {tip.heading}
                                        </div>
                                        <p className="tip-para">
                                            {tip.text}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 d-flex justify-content-center">
                                    <img src={tip.image} alt="Health Tip" className="tip-image" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tips-dots-holder">
                    {tips.map((_, index) => (
                        <div
                            key={index}
                            className={`tip-dot ${activeTip === index ? 'active-tip' : ''}`}
                            onClick={() => setActiveTip(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

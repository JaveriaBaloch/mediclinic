'use client';

import { ChangeEventHandler, useEffect, useState } from 'react';
import { Icon } from "@/components/icons/icon";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SectionHeadings } from '@/components/sectionHeadings';
import { InputField } from '@/components/input';

const Auth = () => {
    const [currentContent, setCurrentContent] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showSignUp, setShowSignUp] = useState(true); // Track whether Sign-Up or Sign-In is displayed

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentContent((prev) => (prev === 3 ? 1 : prev + 1)); // Cycle through contents
        }, 2000); // Change content every 2 seconds

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [currentContent]);

    const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setPassword(event.target.value);
    };

    const toggleAuthMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <div id="Auth">
            <div className="container">
                <div className="row">
                    <div className="intro">
                        <Link href={'/'} className="back">
                            <FontAwesomeIcon icon={faCaretLeft} className="icon-back" color="#FFFFFF" size="xs" />
                            <p>Back To Website</p>
                        </Link>
                        <div className="holder">
                            <div className={`content content-${currentContent} ${currentContent === 1 ? 'fade-in' : ''}`} style={{ transform: currentContent === 1 ? 'translateX(0)' : 'translateX(-100%)' }}>
                                {currentContent === 1 && (
                                    <>
                                        <h1>Online Consultations</h1>
                                        <img src="/home/auth1.png" alt="Online Consultations" />
                                    </>
                                )}
                            </div>
                            <div className={`content content-${currentContent} ${currentContent === 2 ? 'fade-in' : ''}`} style={{ transform: currentContent === 2 ? 'translateX(0)' : 'translateX(-100%)' }}>
                                {currentContent === 2 && (
                                    <>
                                        <h1>Meet Our Doctors</h1>
                                        <img src="/home/auth2.png" alt="Meet Our Doctors" />
                                    </>
                                )}
                            </div>
                            <div className={`content content-${currentContent} ${currentContent === 3 ? 'fade-in' : ''}`} style={{ transform: currentContent === 3 ? 'translateX(0)' : 'translateX(-100%)' }}>
                                {currentContent === 3 && (
                                    <>
                                        <h1>Join Us Today</h1>
                                        <img src="/home/auth3.png" alt="Join Us Today" />
                                    </>
                                )}
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className={`dot ${currentContent === 1 ? 'active-dot' : ''}`} onClick={() => setCurrentContent(1)}></div>
                                <div className={`dot ${currentContent === 2 ? 'active-dot' : ''}`} onClick={() => setCurrentContent(2)}></div>
                                <div className={`dot ${currentContent === 3 ? 'active-dot' : ''}`} onClick={() => setCurrentContent(3)}></div>
                            </div>
                        </div>
                    </div>
                    <div className="forms">
                        <img src="/images/icon.png" alt="" />
                        <div className={`${"form-container"} ${showSignUp ? 'show-signup' : 'show-signin'}`}>
                        <form id='signup'>
                            <SectionHeadings text={'Sign Up'} color='#006AAC' align='justify-content-center' />
                            <div className="container my-3">
                                <InputField
                                    placeholder="Email" 
                                    onTextChange={handleEmailChange} 
                                    type="email" 
                                />
                                <InputField
                                    placeholder="Password" 
                                    onTextChange={handlePasswordChange}
                                    type="password" 
                                />
                                <InputField
                                    placeholder="Confirm Password" 
                                    onTextChange={handlePasswordChange} 
                                    type="password" 
                                />
                                 <InputField
                                    placeholder="Profile Picture" 
                                    onTextChange={handlePasswordChange} 
                                    type="file" 
                                />
                                <button id="signupbtn">
                                    Sign up
                                </button>
                            </div>
                            <p id="showsignin" 
                            onClick={() => {
                                document.querySelector('#signup')?.classList.add('hideup')
                                document.querySelector('#signin')?.classList.add('showup')
                            }}
                            
                            >
                                Already have an account? Sign In
                            </p>
                        </form>
                        <form id='signin'>
                            <SectionHeadings text={isSignUp ? 'Sign In' : 'Sign In'} color='#006AAC' align='justify-content-center' />
                            <div className="container my-3">
                                <InputField
                                    placeholder="Email" 
                                    onTextChange={handleEmailChange} 
                                    type="email" 
                                />
                                <InputField
                                    placeholder="Password" 
                                    onTextChange={handlePasswordChange}
                                    type="password" 
                                />
                                 <button id="signinbtn">
                                    Sign up
                                </button>
                            </div>
                            <p id="showsignup" 
                            onClick={() => {
                                document.querySelector('#signup')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                                document.querySelector('#signin')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                            }}
                                                        
                            >
                                Already have an account? Sign In
                            </p>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

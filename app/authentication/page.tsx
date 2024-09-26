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
    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
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

    const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setUsername(event.target.value)
    };

    const handleProfileImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            console.log(files[0])
            setProfileImage(files[0]);
        }
    };

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', 'patient'); // Default role if not provided
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
    
        console.log('Submitting data:', {
            username,
            email,
            password,
            profileImage,
        });
    
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: formData, // Do not set Content-Type here
        });
    
        const result = await response.json();
        console.log(result); // Check the response from your API
    };
    
    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle successful sign in
                console.log('User signed in successfully:', data);
            } else {
                console.error('Error during sign in:', data.message);
            }
        } catch (error) {
            console.error('Error signing in:', error);
        }
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
                        <form id='signup' onSubmit={handleSignUp} encType='multipart/form-data'>
                            <SectionHeadings text={'Sign Up'} color='#006AAC' align='justify-content-center' />
                            <div className="container my-3">
                            <InputField
                                    placeholder="Username" 
                                    onTextChange={handleUsernameChange} 
                                    type="text" 
                                    name='username'
                                />
                                <InputField
                                    placeholder="Email" 
                                    onTextChange={handleEmailChange} 
                                    type="email" 
                                    name='email'
                                />
                                <InputField
                                    placeholder="Password" 
                                    onTextChange={handlePasswordChange}
                                    type="password" 
                                    name='password'
                                />
                                <InputField
                                    placeholder="Confirm Password" 
                                    onTextChange={handleConfirmPasswordChange} 
                                    type="password" 
                                    name='confirmPassword'
                                />
                                <InputField
                                    placeholder="Profile Picture" 
                                    onTextChange={handleProfileImageChange} 
                                    type="file" 
                                    name="profileImage" 
                                />
                                <button id="signupbtn">
                                    Sign up
                                </button>
                            </div>
                            <p id="showsignin" 
                            onClick={() => {
                                document.querySelector('#signup')?.classList.add('hideup')
                                document.querySelector('#signin')?.classList.add('showup')
                            }}>
                                Already have an account? Sign In
                            </p>
                        </form>
                        <form id='signin' onSubmit={handleSignIn}>
                            <SectionHeadings text={isSignUp ? 'Sign In' : 'Sign In'} color='#006AAC' align='justify-content-center' />
                            <div className="container my-3">
                                <InputField
                                    placeholder="Email" 
                                    onTextChange={handleEmailChange} 
                                    type="email" 
                                    name='email'
                                />
                                <InputField
                                    placeholder="Password" 
                                    onTextChange={handlePasswordChange}
                                    type="password" 
                                    name='password'
                                />
                                <button id="signinbtn">
                                    Sign In
                                </button>
                            </div>
                            <p id="showsignup" 
                            onClick={() => {
                                document.querySelector('#signup')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                                document.querySelector('#signin')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                            }}>
                                Already have an account? Sign Up
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

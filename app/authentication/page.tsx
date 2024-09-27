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
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isSignUp, setIsSignUp] = useState(true); // Track whether Sign-Up or Sign-In is displayed
    const [message, setMessage] = useState("");


    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentContent((prev) => (prev === 3 ? 1 : prev + 1)); // Cycle through contents
        }, 4000); // Change content every 4 seconds
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
        setUsername(event.target.value);
    };

    const handleProfileImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setProfileImage(files[0]);
        } else {
            setProfileImage(null); // Reset if no file selected
        }
    };

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();

        // Define regex patterns
        const usernamePattern = /^[a-zA-Z_-]{3,16}$/; // Letters, underscores, hyphens, 3-16 chars, no numbers
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, one letter, one number

        // Validate fields
        if (!usernamePattern.test(username)) {
            setError(true)
            setMessage('Invalid username. It must be 3-16 characters long and can contain only letters, underscores, or hyphens.');
            return; // Stop execution if validation fails
        }
        if (!emailPattern.test(email)) {
            setError(true)
            setMessage('Invalid email format.');
            return; // Stop execution if validation fails
        }
        if (!passwordPattern.test(password)) {

            setError(true)
            setMessage('Password must be at least 8 characters long and include at least one letter and one number.');
            return; // Stop execution if validation fails
        }
        if (password !== confirmPassword) {
            setError(true)
            setMessage('Passwords do not match.');
            return; // Stop execution if passwords don't match
        }

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

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData, // Do not set Content-Type here
            });

            const result = await response.json();
            console.log(result)
            setMessage(result.message); // Check the response from your API
            if (response.ok) {
                // Clear fields after successful signup
                setError(false)

                setEmail("");
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setProfileImage(null);
                sessionStorage.setItem("_id", result.user._id);
                sessionStorage.setItem("username", result.user.username);
                sessionStorage.setItem("profilePicture", result.user.profileImage);
                sessionStorage.setItem("email", result.user.email);


            } else {
                setError(true)
                setMessage(result.message || "An error occurred during signup.");
            }
        } catch (err) {
            setError(true)
            setMessage("An unexpected error occurred.");
        }
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
                setMessage(data.message)
                // Optionally, clear fields or redirect
                setEmail("");
                setPassword("");
                sessionStorage.setItem("_id", data.user._id);
                sessionStorage.setItem("username", data.user.username);
                sessionStorage.setItem("profilePicture", data.user.profileImage);
                sessionStorage.setItem("email", data.user.email);

            } else {
                setError(true)
                setMessage(data.message || "An error occurred during sign in.");
            }
        } catch (error) {
            setError(true)
            setMessage('Error signing in: ' + error);
        }
    };

    return (
        <div id="Auth">
            {
                (message!="")&&
                <div className={`alert ${error? 'alert-danger':'alert-primary'}`}>{message}</div>
            }
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
                        <div className={`${"form-container"} ${isSignUp ? 'show-signup' : 'show-signin'}`}>
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
                                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                                    <button id="signupbtn">
                                        Sign up
                                    </button>
                                </div>
                                <p  id="showsignin" 
                                    onClick={() => {
                                        document.querySelector('#signup')?.classList.add('hideup')
                                        document.querySelector('#signin')?.classList.add('showup')
                                    }}>
                                    Already have an account? Sign In
                                </p>
                            </form>
                            <form id='signin' onSubmit={handleSignIn}>
                                <SectionHeadings text={'Sign In'} color='#006AAC' align='justify-content-center' />
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
                                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                                    <button id="signinbtn">
                                        Sign In
                                    </button>
                                </div>
                                <p id="showsignup" onClick={() => {
                                document.querySelector('#signup')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                                document.querySelector('#signin')?.classList.remove('hideup')
                                document.querySelector('#signin')?.classList.remove('showup')
                            }}>
                                    Don't have an account? Sign Up
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

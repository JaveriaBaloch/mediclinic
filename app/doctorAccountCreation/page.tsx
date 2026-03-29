'use client';

import { ChangeEventHandler, useEffect, useState } from 'react';
import Image from 'next/image';
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SectionHeadings } from '@/components/sectionHeadings';
import { InputField } from '@/components/input';
import { useRouter } from 'next/navigation';

const DoctorAuth = () => {
    const [currentContent, setCurrentContent] = useState(1);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isSignUp, setIsSignUp] = useState(true);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentContent((prev) => (prev === 3 ? 1 : prev + 1));
        }, 4000);
        return () => clearTimeout(timer);
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
            setProfileImage(null);
        }
    };

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(false);
        setMessage("");

        const normalizedPassword = password.trim();
        const normalizedConfirmPassword = confirmPassword.trim();

        const usernamePattern = /^[a-zA-Z0-9 _-]{3,16}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (!usernamePattern.test(username)) {
            setError(true);
            setMessage('Invalid username. It must be 3-16 characters long.');
            return;
        }
        if (!emailPattern.test(email)) {
            setError(true);
            setMessage('Invalid email format.');
            return;
        }
        if (!passwordPattern.test(normalizedPassword)) {
            setError(true);
            setMessage('Password must be at least 8 characters long and include at least one letter and one number.');
            return;
        }
        if (normalizedPassword !== normalizedConfirmPassword) {
            setError(true);
            setMessage('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', normalizedPassword);
        formData.append('role', 'doctor');
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setError(false);
                setMessage(result.message);
                setEmail("");
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setProfileImage(null);
                sessionStorage.setItem("_id", result.user._id);
                sessionStorage.setItem("username", result.user.username);
                sessionStorage.setItem("profilePicture", result.user.profileImage);
                sessionStorage.setItem("email", result.user.email);
                sessionStorage.setItem("role", result.user.role);
                router.push('/profile');
            } else {
                setError(true);
                setMessage(result.message || "An error occurred during signup.");
            }
        } catch (err) {
            setError(true);
            setMessage("An unexpected error occurred.");
        }
    };

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(false);
        setMessage("");

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setError(false);
                setMessage(data.message);
                setEmail("");
                setPassword("");
                sessionStorage.setItem("_id", data.user._id);
                sessionStorage.setItem("username", data.user.username);
                sessionStorage.setItem("profilePicture", data.user.profileImage);
                sessionStorage.setItem("email", data.user.email);
                sessionStorage.setItem("role", data.user.role);
                router.push('/');
            } else {
                setError(true);
                setMessage(data.message || "An error occurred during sign in.");
            }
        } catch (err) {
            setError(true);
            setMessage("An unexpected error occurred.");
        }
    };

    return (
        <div id="Auth">
            {message !== "" && (
                <div className={`alert ${error ? 'alert-danger' : 'alert-primary'}`}>{message}</div>
            )}
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
                                        <Image src="/home/auth1.png" alt="Online Consultations" width={300} height={200} />
                                    </>
                                )}
                            </div>
                            <div className={`content content-${currentContent} ${currentContent === 2 ? 'fade-in' : ''}`} style={{ transform: currentContent === 2 ? 'translateX(0)' : 'translateX(-100%)' }}>
                                {currentContent === 2 && (
                                    <>
                                        <h1>Meet Our Doctors</h1>
                                        <Image src="/home/auth2.png" alt="Meet Our Doctors" width={300} height={200} />
                                    </>
                                )}
                            </div>
                            <div className={`content content-${currentContent} ${currentContent === 3 ? 'fade-in' : ''}`} style={{ transform: currentContent === 3 ? 'translateX(0)' : 'translateX(-100%)' }}>
                                {currentContent === 3 && (
                                    <>
                                        <h1>Join Us Today</h1>
                                        <Image src="/home/auth3.png" alt="Join Us Today" width={300} height={200} />
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
                        <Image src="/images/icon.png" alt="Mediclinic Icon" width={80} height={80} />
                        <div className={`form-container ${isSignUp ? 'show-signup' : 'show-signin'}`}>
                            {isSignUp ? (
                                <form id="signup" onSubmit={handleSignUp} encType="multipart/form-data">
                                    <SectionHeadings text={'Doctor Account Creation'} color="#006AAC" align="justify-content-center" />
                                    <div className="container my-3">
                                        <InputField placeholder="Username" onTextChange={handleUsernameChange} type="text" name="username" />
                                        <InputField placeholder="Email" onTextChange={handleEmailChange} type="email" name="email" />
                                        <InputField placeholder="Password" onTextChange={handlePasswordChange} type="password" name="password" />
                                        <InputField placeholder="Confirm Password" onTextChange={handleConfirmPasswordChange} type="password" name="confirmPassword" />
                                        <InputField placeholder="Profile Picture" onTextChange={handleProfileImageChange} type="file" name="profileImage" />
                                        {error && <p className="error-message">{message}</p>}
                                        <button id="signupbtn">Sign up</button>
                                    </div>
                                    <p id="showsignin" onClick={() => { setIsSignUp(false); setError(false); setMessage(""); }}>
                                        Already have an account? Sign In
                                    </p>
                                </form>
                            ) : (
                                <form id="signin" onSubmit={handleSignIn}>
                                    <SectionHeadings text={'Sign In'} color="#006AAC" align="justify-content-center" />
                                    <div className="container my-3">
                                        <InputField placeholder="Email" onTextChange={handleEmailChange} type="email" name="email" />
                                        <InputField placeholder="Password" onTextChange={handlePasswordChange} type="password" name="password" />
                                        {error && <p className="error-message">{message}</p>}
                                        <button id="signinbtn">Sign In</button>
                                    </div>
                                    <p id="showsignup" onClick={() => { setIsSignUp(true); setError(false); setMessage(""); }}>
                                        Don&apos;t have an account? Sign Up
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAuth;
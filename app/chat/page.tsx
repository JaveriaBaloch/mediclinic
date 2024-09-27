'use client';
import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import './style.scss';
import { Icon } from '@/components/icons/icon';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const MessagePage = () => {
    const [message, setMessage] = useState('');
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null); // For downloadable file

    const clients = [
        { img: '/home/image.png', name: 'Ahmed Syed', specialization: 'Endocrinologist' },
        { img: '/home/image.png', name: 'Client 2', specialization: 'Cardiologist' },
        { img: '/home/image.png', name: 'Client 3', specialization: 'Dermatologist' },
        { img: '/home/image.png', name: 'Client 4', specialization: 'Pediatrician' },
        { img: '/home/image.png', name: 'Client 5', specialization: 'Orthopedist' }
    ];

    // Handle file upload (image or PDF) and preview
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const fileUrl = URL.createObjectURL(file); // Generate URL for the file
            setFileUrl(fileUrl); // Set URL for the download button

            if (file.type.startsWith('image/')) {
                // Preview image
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                // Set PDF file name for preview
                setFilePreview(null); // No image preview for PDF
            }
        }
    };

    // Handle message sending logic
    const handleSendMessage = () => {
        if (message.trim() || filePreview || fileName) {
            // Logic to send the message and file
            console.log('Message:', message);
            if (filePreview) {
                console.log('File Preview:', filePreview); // Base64 for images
            }
            if (fileName) {
                console.log('File Name:', fileName); // Show PDF name
            }
            if (fileUrl) {
                console.log('File URL:', fileUrl); // URL for the downloadable file
            }
            // Reset after sending
            setMessage('');
            setFilePreview(null);
            setFileName(null);
            setFileUrl(null);
        }
    };

    return (
        <div id="Chat">
            <Navbar activeItem={4} />
            <div className="container-fluid mt-5 pt-5">
                <div className="row mt-4 px-5">
                    {/* Clients/Contacts Section */}
                    <div className="col-xl-3 col-lg-4 col-md-9 col-sm-9 mx-auto">
                        <div className="rounded-4 bg-white pt-3 pb-3 ps-2 pe-2">
                            <div className="clients">
                                {clients.map((client, index) => (
                                    <div className="client" key={index}>
                                        <div className="d-flex justify-center align-align-center">
                                            <img src={client.img} className="contact-image" alt={client.name} />
                                            <div className="ps-2 text-holder">
                                                <p className="contact-name">{client.name}</p>
                                                <small>{client.specialization}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className="col-xl-9 col-lg-8 col-md-9 col-sm-9 mx-auto">
                        <div className="rounded-4 bg-white p-3 ms-2">
                            <div className="messages">
                                <div className="complete-message px-5 pb-3 pt-3 rounded-4">
                                    <div className="attachments">
                                        {filePreview ? (
                                            <div className="file-preview">
                                                <img src={filePreview} alt="Selected" className="img-fluid" />
                                                {fileUrl && (
                                                    <a  href={fileUrl} download={fileName} >
                                                   <Icon icon={faDownload} color='#01A1BB' size='2x' />
                                                   </a>
                                                )}
                                            </div>
                                        ) : fileName ? (
                                            <div className="file-preview">
                                                <p>{fileName}</p>
                                                {fileUrl && (
                                                      <a  href={fileUrl} download={fileName} >
                                                      <Icon icon={faDownload} color='#01A1BB' size='2x' />
                                                      </a>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Input Area for Messages */}
                                    <div className="input-area d-flex">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your message here"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleFileUpload}
                                            className="form-control ms-2"
                                        />
                                        <button className="btn circle-btn ml-2" onClick={handleSendMessage}>
                                            <Icon color="#fff" icon={faPaperPlane} size="xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;

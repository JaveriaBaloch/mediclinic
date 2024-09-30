'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import './style.scss';
import { Icon } from '@/components/icons/icon';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const MessagePage = () => {
    const [message, setMessage] = useState('');
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]); // Store fetched messages
    const senderId = sessionStorage.getItem('_id'); // Get sender's ID from session

    const clients = [
        { img: '/home/image.png', name: 'Ahmed Syed', specialization: 'Endocrinologist' },
        { img: '/home/image.png', name: 'Client 2', specialization: 'Cardiologist' },
        { img: '/home/image.png', name: 'Client 3', specialization: 'Dermatologist' },
        { img: '/home/image.png', name: 'Client 4', specialization: 'Pediatrician' },
        { img: '/home/image.png', name: 'Client 5', specialization: 'Orthopedist' },
    ];

    // Fetch all messages from the backend
    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/messages/getall'); // Adjust this path if needed
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Handle file upload (image or PDF) and preview
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const fileUrl = URL.createObjectURL(file);
            setFileUrl(fileUrl); // Set URL for the download button

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                setFilePreview(null);
            }
        }
    };

    // Handle message sending logic
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission

        if (message.trim() || filePreview || fileName) {
            const formData = new FormData();
            formData.append('senderId', senderId || '');
            formData.append('receiverId', '1'); // Replace with actual receiver ID
            formData.append('message', message);

            const fileInput = document.querySelector('input[type="file"]');
            const file = (fileInput as HTMLInputElement).files?.[0];
            if (file) {
                formData.append('file', file);
            }

            try {
                const response = await fetch('/api/messages/send', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Message sent');
                    setMessage('');
                    setFilePreview(null);
                    setFileName(null);
                    setFileUrl(null);
                    fetchMessages(); // Refresh message list after sending
                } else {
                    console.error('Error sending message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Fetch messages when component mounts
    useEffect(() => {
        fetchMessages();
    }, []);

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
                            <div className="col-7">
                                <div className="message-list">
                                     {messages.map((msg) => (
                                         <div key={msg._id} className="message">
                                             {/* <strong>{msg.senderId}: </strong> */}
                                             <div>
                                             {msg.text}
                                             </div>
                                             {msg.fileUrl && (
                                               <div>
                                               <img src={msg.fileUrl} width={100}/>
                                                 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                                     <Icon icon={faDownload} color="#01A1BB" size="1x" />
                                                 </a>
                                                 </div>
                                             )}
                                         </div>
                                     ))}
                                </div>
                                </div>
                                <div className="complete-message px-5 pb-3 pt-3 rounded-4">

                                    <div className="attachments">
                                        {filePreview ? (
                                            <div className="file-preview">
                                                <img src={filePreview} alt="Selected" className="img-fluid" />
                                                {fileUrl && (
                                                    <a href={fileUrl} download={fileName}>
                                                        <Icon icon={faDownload} color="#01A1BB" size="2x" />
                                                    </a>
                                                )}
                                            </div>
                                        ) : fileName ? (
                                            <div className="file-preview">
                                                <p>{fileName}</p>
                                                {fileUrl && (
                                                    <a href={fileUrl} download={fileName}>
                                                        <Icon icon={faDownload} color="#01A1BB" size="2x" />
                                                    </a>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Input Area for Messages */}
                                    <form onSubmit={handleSendMessage} className="input-area d-flex">
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
                                        <button type="submit" className="btn circle-btn ml-2">
                                            <Icon color="#fff" icon={faPaperPlane} size="xl" />
                                        </button>
                                    </form>
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

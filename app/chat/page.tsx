'use client'; // This directive makes the component a client component

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import './style.scss';
import { Icon } from '@/components/icons/icon';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const MessagePage = () => {
    const [message, setMessage] = useState('');
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const senderId = sessionStorage.getItem('_id');

    const fetchContacts = async () => {
        const userId = sessionStorage.getItem('_id');
        if (!userId) return;

        try {
            const response = await axios.get(`/api/contacts/getAll?userId=${userId}`);
            setContacts(response.data.contacts);
            setFilteredContacts(response.data.contacts); // Initialize filtered contacts
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const fetchMessages = async (contactId: string) => {
        try {
            const response = await axios.get(`/api/messages/getByContact?senderId=${senderId}&receiverId=${contactId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const fileUrl = URL.createObjectURL(file);
            setFileUrl(fileUrl);

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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() || filePreview || fileName) {
            const formData = new FormData();
            formData.append('senderId', senderId || '');
            formData.append('receiverId', selectedContactId || '');
            formData.append('message', message);

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = fileInput.files?.[0];
            if (file) {
                formData.append('file', file);
            }

            try {
                const response = await axios.post('/api/messages/send', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setMessage('');
                    setFilePreview(null);
                    setFileName(null);
                    setFileUrl(null);
                    fetchMessages(selectedContactId || '');
                } else {
                    console.error('Error sending message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Filter contacts by search query
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = contacts.filter((contact) =>
            contact.name.toLowerCase().includes(query)
        );
        setFilteredContacts(filtered);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContactId) {
            fetchMessages(selectedContactId);
            const interval = setInterval(() => {
                fetchMessages(selectedContactId);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [selectedContactId]);

    return (
        <div id="Chat">
            <Navbar activeItem={4} />
            <div className="container-fluid mt-5 pt-5">
                <div className="row mt-4 px-0 rounded-4">
                    {/* Clients/Contacts Section */}
                    <div className="col-xl-3 col-lg-4 col-md-9 col-sm-9 mx-auto rounded-4">
                        <div className="rounded-4 bg-white p-0">
                            {/* Search Input */}
                            <div className="search-bar p-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search clients..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="clients  pt-3 pb-3 ps-2 pe-2 rounded-4">
                                {filteredContacts.map((contact) => (
                                    <div
                                        className={`client px-3 py-2 ${contact.contactId === selectedContactId ? 'active-contact' : ''}`} // Add conditional class
                                        key={contact.contactId}
                                        onClick={() => {
                                            setSelectedContactId(contact.contactId);
                                            fetchMessages(contact.contactId);
                                        }}
                                    >
                                        <div className="d-flex justify-center align-align-center">
                                            <img src={contact.profileImage} className="contact-image" alt={contact.name} />
                                            <div className="ps-2 text-holder">
                                                <p className="contact-name">{contact.name}</p>
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
                                <div className="col-12">
                                    <div className="message-list">
                                        {messages.map((msg) => (
                                            <div key={msg._id} className={`message my-3 ${msg.senderId == senderId ? 'my-message' : 'not-my-message'}`}>
                                                <div className="text">{msg.text}</div>
                                                {msg.fileUrl && (
                                                    <div>
                                                        <img src={msg.fileUrl} width={100} alt="Attachment" />
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

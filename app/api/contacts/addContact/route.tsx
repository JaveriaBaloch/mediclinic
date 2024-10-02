'use server'; // This directive indicates that this is a server action.

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ContactListModal from '@/model/contactListModal'; // Adjust the path based on your folder structure
import { connectDB } from '@/lib/mongodb'; // Ensure this connects to your MongoDB

// Handle POST requests to add or update a contact
export async function POST(req: Request) {
    const { userId, contactId, userProfileImage, name, receiverProfileImage, receiverName } = await req.json();

    // Validate input parameters
    if (!userId || !contactId || !userProfileImage || !name || !receiverProfileImage || !receiverName) {
        return NextResponse.json(
            { message: 'User ID, contact ID, user profile image, name, receiver profile image, and receiver name are required' },
            { status: 400 }
        );
    }

    await connectDB();

    try {
        // Remove the contact from the sender's list if it exists
        await ContactListModal.updateOne(
            { userId },
            {
                $pull: { contacts: { contactId } } // Remove contactId from contacts
            }
        );

        // Add the contact again to the sender's contact list
        const senderContactList = await ContactListModal.findOneAndUpdate(
            { userId },
            {
                $addToSet: {
                    contacts: {
                        contactId,
                        profileImage: userProfileImage,
                        name
                    }
                }
            },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );

        // Remove the contact from the receiver's list if it exists
        await ContactListModal.updateOne(
            { userId: contactId },
            {
                $pull: { contacts: { contactId: userId } } // Remove the user's contactId from the receiver's contacts
            }
        );

        // Add the contact again to the receiver's contact list
        const receiverContactList = await ContactListModal.findOneAndUpdate(
            { userId: contactId },
            {
                $addToSet: {
                    contacts: {
                        contactId: userId,
                        profileImage: receiverProfileImage,
                        name: receiverName
                    }
                }
            },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );

        return NextResponse.json(
            { message: 'Contact updated successfully for both sender and receiver' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

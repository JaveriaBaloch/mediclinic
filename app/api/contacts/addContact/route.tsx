'use server';

import { NextResponse } from 'next/server';
import ContactListModel from '@/model/contactListModal'; // Ensure this path is correct based on your folder structure
import { connectDB } from '@/lib/mongodb'; // Connect to your MongoDB

// Handle POST requests to add or update a contact
export async function POST(req: Request) {
    const { userId, contactId, userProfileImage, name, receiverProfileImage, receiverName } = await req.json();

    // Validate input parameters
    if (!userId || !contactId || !userProfileImage || !name || !receiverProfileImage || !receiverName) {
        return NextResponse.json(
            { message: 'All fields (userId, contactId, profile images, and names) are required.' },
            { status: 400 }
        );
    }

    // Connect to the database
    await connectDB();

    try {
        // Remove the contact from the sender's list if it exists
        await ContactListModel.updateOne(
            { userId },
            {
                $pull: { contacts: { contactId } } // Remove contactId from sender's contacts
            }
        );

        // Add the contact to the sender's contact list
        await ContactListModel.findOneAndUpdate(
            { userId },
            {
                $addToSet: {
                    contacts: {
                        contactId,
                        profileImage: receiverProfileImage, // Receiver's profile image
                        name: receiverName // Receiver's name
                    }
                }
            },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );

        // Remove the contact from the receiver's list if it exists
        await ContactListModel.updateOne(
            { userId: contactId },
            {
                $pull: { contacts: { contactId: userId } } // Remove user's contactId from receiver's contacts
            }
        );

        // Add the contact to the receiver's contact list
        await ContactListModel.findOneAndUpdate(
            { userId: contactId },
            {
                $addToSet: {
                    contacts: {
                        contactId: userId,
                        profileImage: userProfileImage, // Sender's profile image
                        name: name // Sender's name
                    }
                }
            },
            { new: true, upsert: true } // Create a new document if it doesn't exist
        );

        return NextResponse.json(
            { message: 'Contact updated successfully for both sender and receiver.' },
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

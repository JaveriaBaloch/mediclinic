import { NextResponse } from 'next/server';
import ContactListModal from '@/model/contactListModal'; // Adjust the path based on your folder structure
import { connectDB } from '@/lib/mongodb'; // Ensure this connects to your MongoDB

// Handle GET requests to retrieve contacts
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { message: 'User ID is required' },
            { status: 400 }
        );
    }

    await connectDB();

    try {
        // Find the contact list for the user
        const contactList = await ContactListModal.findOne({ userId });

        if (!contactList) {
            return NextResponse.json(
                { message: 'No contacts found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { contacts: contactList.contacts },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

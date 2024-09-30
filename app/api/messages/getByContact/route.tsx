import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/model/messageModel';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    // Validate senderId and receiverId
    if (!senderId || !receiverId) {
        return NextResponse.json(
            { message: 'Sender ID and Receiver ID are required.' },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        // Fetch messages based on senderId and receiverId
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by creation time

        // Check if messages exist
        if (messages.length === 0) {
            return NextResponse.json({ message: 'No messages found.' }, { status: 404 });
        }

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ message: 'Error fetching messages', error: error.message }, { status: 500 });
    }
}

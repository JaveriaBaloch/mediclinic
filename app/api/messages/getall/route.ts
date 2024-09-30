import { connectDB } from "@/lib/mongodb";
import Message from "@/model/messageModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        // Fetch all messages from the database
        const messages = await Message.find().sort({ createdAt: -1 }); // Sort by most recent

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return NextResponse.json({ message: 'Error retrieving messages', error }, { status: 500 });
    }
}
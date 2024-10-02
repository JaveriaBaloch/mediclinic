import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Availability from '@/model/availabilityModal'; // Adjust the path as necessary
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    // Validate input
    if (!doctorId) {
        return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
    }

    try {
        // Connect to MongoDB
        await connectDB();

        // Validate doctorId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return NextResponse.json({ message: 'Invalid Doctor ID' }, { status: 400 });
        }

        // Find all availabilities for the doctor
        const availabilities = await Availability.find({
            doctorId: new mongoose.Types.ObjectId(doctorId)
        });

        if (availabilities.length === 0) {
            return NextResponse.json({ message: 'No availability found for this doctor' }, { status: 404 });
        }

        // Return all availability entries
        return NextResponse.json(availabilities, { status: 200 });

    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

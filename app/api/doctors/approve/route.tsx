import { NextRequest, NextResponse } from 'next/server';
import Doctor from '@/model/doctorModal';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    // Check if doctorId is provided
    if (!doctorId) {
        return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
    }

    await connectDB(); // Ensure the database connection

    try {
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { doctorId },
            { status: 'accepted' }, // Set the doctor's status to 'accepted'
            { new: true } // Return the updated document
        );

        // If the doctor is not found, return a 404 response
        if (!updatedDoctor) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }

        // Return the updated doctor information
        return NextResponse.json(updatedDoctor, { status: 200 });
    } catch (error) {
        console.error('Error updating doctor:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
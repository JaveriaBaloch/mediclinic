import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/model/doctorModal';

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
            { status: 'rejected' }, // Set the doctor's status to 'rejected'
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
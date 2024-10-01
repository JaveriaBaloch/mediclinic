import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/model/AppointmentModal'; // Import your Appointment model

// GET handler for retrieving all appointments
export async function GET(req: NextRequest) {
    await connectDB(); // Ensure you connect to the database

    try {
        const appointments = await Appointment.find({}); // Fetch all appointments
        return NextResponse.json({ success: true, appointments }, { status: 200 });
    } catch (error) {
        console.error('Error fetching appointments:', error); // Log the specific error
        return NextResponse.json({ message: 'Error fetching appointments', error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/model/AppointmentModal'; // Import your Appointment model

// GET handler for retrieving all appointments for a specific doctor
export async function GET(req: NextRequest) {
    await connectDB(); // Ensure you connect to the database

    // Retrieve the searchParams from the request URL
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('id'); // Get the doctor ID from query parameters

    try {
        if (!patientId) {
            return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
        }

        // Fetch appointments for the given doctor ID
        const appointments = await Appointment.find({ patientId  });

        if (appointments.length === 0) {
            return NextResponse.json({ success: true, message: 'No appointments found for this doctor.' }, { status: 200 });
        }

        return NextResponse.json({ success: true, appointments }, { status: 200 });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({ message: 'Error fetching appointments', error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/model/AppointmentModal';

export async function GET(req: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const dateString = searchParams.get('date');

    // Validate query parameters
    if (!doctorId || !dateString) {
        return NextResponse.json({ message: 'Doctor ID and date are required.' }, { status: 400 });
    }

    console.log('Received date string:', dateString); // Log the received date string

    // Parse date
    const date = new Date(dateString);
    console.log('Parsed date:', date); // Log the parsed date

    if (isNaN(date.getTime())) {
        return NextResponse.json({ message: 'Invalid date format. Please use a valid ISO 8601 date.' }, { status: 400 });
    }

    try {
        const appointments = await Appointment.find({
            doctorId,
            date: {
                $gte: date,
                $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Get appointments for the whole day
            },
        });

        const bookedSlots = appointments.map(appointment => {
            const appointmentDate = new Date(appointment.appointmentTime);
            return {
                time: `${appointmentDate.getHours()}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`,
                type: appointment.appointmentType, // Assuming you have a 'type' field in your appointment model
            };
        });

        return NextResponse.json({ bookedSlots }, { status: 200 });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

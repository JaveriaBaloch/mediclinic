import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/model/AppointmentModal'; // Import your Appointment model

// Simple regex patterns for validation
const insuranceNumberPattern = /^\d{9}$/; // Example: 9-digit insurance number
const namePattern = /^[A-Za-z\s]+$/; // Alphabets and spaces only
const phonePattern = /^\d{10}$/; // 10-digit phone number

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("Incoming Request Body:", body); // Log the incoming data

    const { doctorId, patientId, insuranceNumber, name, phone, appointmentType, date, appointmentTime, imageUrl } = body;

    // Basic validation of fields
    if (!doctorId || !patientId || !insuranceNumber || !name || !phone || !appointmentType || !date || !appointmentTime) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Additional regex validation
    if (!insuranceNumberPattern.test(insuranceNumber)) {
        return NextResponse.json({ message: 'Invalid insurance number format. It should be 9 digits.' }, { status: 400 });
    }

    if (!namePattern.test(name)) {
        return NextResponse.json({ message: 'Invalid name format. Only letters and spaces are allowed.' }, { status: 400 });
    }

    if (!phonePattern.test(phone)) {
        return NextResponse.json({ message: 'Invalid phone number format. It should be 10 digits.' }, { status: 400 });
    }

    await connectDB(); // Connect to MongoDB

    try {
        // Convert date and appointmentTime to Date objects
        const appointmentDate = new Date(date);
        const appointmentDateTime = new Date(appointmentTime);

        // Check if the time slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentTime: appointmentDateTime,
        });

        if (existingAppointment) {
            return NextResponse.json({ message: 'Time slot is already booked' }, { status: 409 }); // 409 Conflict status
        }

        // Create a new appointment with imageUrl
        const appointment = new Appointment({
            doctorId,
            patientId,
            insuranceNumber,
            name,
            phone,
            appointmentType,
            date: appointmentDate, // Store the date as a Date object
            appointmentTime: appointmentDateTime, // Store the appointment time as a Date object
            imageUrl, // Store the image URL
        });

        await appointment.save();
        return NextResponse.json({ success: true, message: 'Appointment booked successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving appointment:', error); // Log the specific error
        return NextResponse.json({ message: 'Error saving appointment', error: error.message }, { status: 500 });
    }
}

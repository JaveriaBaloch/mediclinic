// pages/api/appointments/book.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Import your db connection function
import Appointment from '@/model/AppointmentModal'; // Import your Appointment model

// Handle GET request
export async function GET(req: NextRequest) {
  await connectDB();
  
  // Use .get() to safely retrieve query parameters
  const { searchParams } = req.nextUrl;
  const doctorId = searchParams.get('doctorId'); // Use .get() to retrieve the doctorId
  const date = searchParams.get('date'); // Use .get() to retrieve the date
  
  if (!doctorId || !date) {
    return NextResponse.json({ message: "doctorId and date are required" }, { status: 400 });
  }

  try {
    const appointments = await Appointment.find({ doctorId, date });
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ message: "Error fetching appointments" }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  await connectDB();
  
  const {
    doctorId,
    insuranceNumber,
    name,
    phone,
    appointmentType,
    date,
    appointmentTime,
  } = await req.json();

  // Validate required fields
  if (!doctorId || !insuranceNumber || !name || !phone || !appointmentType || !date || !appointmentTime) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  // Check if the appointment already exists
  const existingAppointment = await Appointment.findOne({ 
    doctorId, 
    date, 
    appointmentTime 
  });

  if (existingAppointment) {
    return NextResponse.json({ message: "Appointment already exists at this time" }, { status: 409 });
  }

  // Create a new appointment
  const newAppointment = new Appointment({
    doctorId,
    insuranceNumber,
    name,
    phone,
    appointmentType,
    date,
    appointmentTime,
  });

  try {
    await newAppointment.save();
    return NextResponse.json({ message: "Appointment successfully booked!" }, { status: 201 });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json({ message: "Error booking appointment" }, { status: 500 });
  }
}

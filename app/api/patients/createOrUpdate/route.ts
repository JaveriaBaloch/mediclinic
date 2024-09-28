import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/model/patientModel';

export async function POST(req: NextRequest) {
    const { patientId, name, age, gender, dateOfBirth, phone, email, address, emergencyContact, insuranceProvider } = await req.json();

    await connectDB();

    if (!patientId) {
        return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    try {
        // Check if patient exists
        let patient = await Patient.findOne({ patientId });

        if (patient) {
            // Update the existing patient
            patient = await Patient.findByIdAndUpdate(patient._id, {
                name,
                age,
                gender,
                dateOfBirth,
                phone,
                email,
                address,
                emergencyContact,
                insuranceProvider,
                updatedAt: new Date(),
            }, { new: true });

            return NextResponse.json({ message: 'Patient updated successfully', patient });
        } else {
            // Create a new patient
            const newPatient = await Patient.create({
                patientId,
                name,
                age,
                gender,
                dateOfBirth,
                phone,
                email,
                address,
                emergencyContact,
                insuranceProvider,
            });

            return NextResponse.json({ message: 'Patient created successfully', patient: newPatient });
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

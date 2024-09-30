import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/model/patientModel';

export async function GET(req: NextRequest) {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
        return NextResponse.json({ message: 'Patient ID is required.' }, { status: 400 });
    }

    try {
        const patient = await Patient.findOne({patientId});

        if (!patient) {
            return NextResponse.json({ message: 'Patient not found.' }, { status: 404 });
        }

        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return NextResponse.json({ message: 'Error fetching patient profile.' }, { status: 500 });
    }
}

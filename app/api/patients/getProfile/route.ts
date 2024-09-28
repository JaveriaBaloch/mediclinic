import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Patient from '@/model/patientModel';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    await connectDB();

    if (!patientId) {
        return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    try {
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }
        return NextResponse.json(patient);
    } 
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

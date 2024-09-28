// pages/api/patients/updateProfile.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Patient from '@/model/patientModel';

export async function PUT(req: NextRequest) {
    await connectDB();

    const patientId = sessionStorage.getItem('_id');

    if (!patientId) {
        return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    try {
        const body = await req.json();
        const updatedPatient = await Patient.findOneAndUpdate({ patientId }, body, { new: true, runValidators: true });
        if (!updatedPatient) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }
        return NextResponse.json(updatedPatient);
    } 
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

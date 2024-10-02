import Availability from '@/model/availabilityModal';
import AppointmentModal, { IAppointment } from '@/model/AppointmentModal';

export async function rescheduleAppointments(doctorId: string) {
    // Fetch availability records sorted by startDate
    const availabilityRecords = await Availability.find({ doctorId }).sort({ startDate: 1 });

    if (availabilityRecords.length === 0) {
        console.log('No availability records found.');
        return;
    }

    // Extract vacation dates from availability records
    const vacationDates = availabilityRecords.map(record => ({
        startDate: record.startDate,
        endDate: record.endDate,
    }));

    // Fetch existing appointments for the doctor
    const appointments: IAppointment[] = await AppointmentModal.find({ doctorId });

    // Define appointment durations in milliseconds
    const appointmentDurations: { [key: string]: number } = {
        'Quick Checkup': 30 * 60 * 1000, // 30 minutes
        'Extensive Care': 60 * 60 * 1000, // 1 hour
        'Operation': 2 * 60 * 60 * 1000,  // 2 hours
    };

    // Reschedule appointments that fall on vacation dates
    for (const appointment of appointments) {
        const appointmentDate = appointment.appointmentTime;

        // Check if the appointment falls within any vacation period
        for (const { startDate, endDate } of vacationDates) {
            if (appointmentDate >= startDate && appointmentDate <= endDate) {
                // Reschedule logic: Move the appointment to the next available date after the vacation
                let newDate = new Date(endDate);
                newDate.setDate(newDate.getDate() + 1); // Move to the next day

                // Set the initial time to 8:00 AM (start of the workday)
                newDate.setHours(8, 0, 0, 0);

                // Get the duration based on appointment category
                const duration = appointmentDurations[appointment.appointmentType];

                // Check for duplicates on the new date
                while (true) {
                    const duplicateAppointment = await AppointmentModal.findOne({
                        doctorId,
                        appointmentTime: { $gte: newDate, $lt: new Date(newDate.getTime() + duration) },
                    });

                    // If a duplicate exists, increment the time
                    if (duplicateAppointment) {
                        newDate.setMinutes(newDate.getMinutes() + 30); // Try next time slot (30 minutes increment)

                        // Check if we hit the lunch break
                        if (newDate.getHours() === 12 && newDate.getMinutes() === 0) {
                            newDate.setHours(13, 0, 0, 0); // Skip to 1:00 PM
                        }

                        // If the new time exceeds 6 PM, reset to the next day at 8 AM
                        if (newDate.getHours() >= 18) {
                            newDate.setDate(newDate.getDate() + 1);
                            newDate.setHours(8, 0, 0, 0); // Reset to 8:00 AM
                        }
                    } else {
                        // No duplicates found, break the loop
                        break;
                    }
                }

                // Set the new appointment end time based on the duration
                const newEndTime = new Date(newDate.getTime() + duration);

                // Check if the new end time exceeds work hours and handle accordingly
                if (newEndTime.getHours() > 18) {
                    // If it exceeds, adjust to the next available slot
                    newDate.setDate(newDate.getDate() + 1); // Move to the next day
                    newDate.setHours(8, 0, 0, 0); // Reset to 8:00 AM
                }

                // Update the appointment with the new date
                await AppointmentModal.findByIdAndUpdate(appointment._id, { appointmentTime: newDate });
                console.log(`Appointment for ${appointment.name} rescheduled to ${newDate}`);
                break; // Exit the vacation check loop after rescheduling
            }
        }
    }
}

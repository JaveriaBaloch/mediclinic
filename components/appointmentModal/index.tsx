import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

interface AppointmentModalProps {
  doctorId: string | number;
  doctorName: string;
  closeModal: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ doctorId, doctorName, closeModal }) => {
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Regex patterns
  const insuranceNumberPattern = /^\d{9}$/; // 9 digits for example
  const namePattern = /^[A-Za-z\s]+$/; // Alphabets and spaces only
  const phonePattern = /^\d{10}$/; // Enforcing a 10-digit phone number

  const isValidInsuranceNumber = insuranceNumberPattern.test(insuranceNumber);
  const isValidName = namePattern.test(name);
  const isValidPhone = phonePattern.test(phone);

  // Define appointment durations in minutes
  const appointmentDurations: { [key: string]: number } = {
    'Quick Checkup': 30,
    'Extensive Care': 60,
    'Operation': 120,
  };

  const generateTimeSlots = () => {
    const timeSlots: string[] = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        // Skip lunch break from 12:00 to 12:30
        if (hour === 12 && minute === 0) continue;
        if (hour === 12 && minute === 30) continue;

        const time = `${hour}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(time);
      }
    }
    return timeSlots;
  };

  const removeOverlappingSlots = (allSlots: string[], bookedSlots: string[], duration: number) => {
    const bookedWithDuration = new Set<string>();
    
    // Convert time strings to minutes for easier calculations
    const timeToMinutes = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      return hour * 60 + minute;
    };

    const minutesToTime = (minutes: number) => {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      return `${hour}:${minute.toString().padStart(2, '0')}`;
    };

    // Mark all time slots that conflict with booked ones based on their duration
    bookedSlots.forEach((slot) => {
      const bookedTime = timeToMinutes(slot);
      for (let i = 0; i < duration; i += 30) {
        bookedWithDuration.add(minutesToTime(bookedTime + i));
      }
    });

    // Filter out overlapping time slots
    return allSlots.filter((slot) => !bookedWithDuration.has(slot));
  };

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (date && appointmentType) {
        setLoading(true);
        try {
          const bookedResponse = await axios.get(`/api/appointments/booked?doctorId=${doctorId}&date=${date}`);
          const bookedTimesData = bookedResponse.data.bookedSlots || [];
          const bookedTimes = bookedTimesData.map((appointment: any) => appointment.time);

          const allTimeSlots = generateTimeSlots();
          const duration = appointmentDurations[appointmentType] || 30; // Default to 30 minutes if not found
          const filteredAvailableTimes = removeOverlappingSlots(allTimeSlots, bookedTimes, duration);

          setAvailableTimes(filteredAvailableTimes);
        } catch (error) {
          setErrorMessage("Error fetching available times. Please try again.");
          console.error("Error fetching availability:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAvailableTimes();
  }, [date, doctorId, appointmentType]);

  const handleSubmit = async () => {
    if (!insuranceNumber || !name || !phone || !appointmentType || !selectedTime || !date) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidInsuranceNumber) {
      alert("Invalid insurance number. It must be a 9-digit number.");
      return;
    }

    if (!isValidName) {
      alert("Invalid name. Only alphabetic characters and spaces are allowed.");
      return;
    }

    if (!isValidPhone) {
      alert("Invalid phone number. Must be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const appointmentDate = new Date(date);
      const [hour, minute] = selectedTime.split(':').map(Number);
      appointmentDate.setHours(hour, minute);

      await axios.post('/api/appointments/book', {
        doctorId,
        patientId: sessionStorage.getItem('_id'),
        insuranceNumber,
        name,
        phone,
        appointmentType,
        imageUrl: sessionStorage.getItem('profilePicture'), // Check if this returns a valid URL
        date: appointmentDate.toISOString(),
        appointmentTime: appointmentDate.toISOString(),
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    

      alert('Appointment successfully booked!');
      closeModal();
    } catch (error) {
      setErrorMessage("Error booking appointment. Please try again.");
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Book Appointment with Dr. {doctorName}</h3>

        {errorMessage && <div className="error">{errorMessage}</div>}

        <label>Insurance Number</label>
        <input
          type="text"
          value={insuranceNumber}
          onChange={(e) => setInsuranceNumber(e.target.value)}
          placeholder="Enter Insurance Number"
        />
        {!isValidInsuranceNumber && insuranceNumber && <span className="error">Invalid Insurance Number</span>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        {!isValidName && name && <span className="error">Invalid Name</span>}

        <label>Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
        {!isValidPhone && phone && <span className="error">Invalid Phone Number</span>}

        <label>Appointment Type</label>
        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
          <option value="">Select Appointment Type</option>
          <option value="Quick Checkup">Quick Checkup (30 mins)</option>
          <option value="Extensive Care">Extensive Care (1 hour)</option>
          <option value="Operation">Operation (2 hours)</option>
        </select>

        <label>Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Select Available Time</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} disabled={loading}>
          <option value="">Select Time</option>
          {loading ? (
            <option value="">Loading times...</option>
          ) : (
            availableTimes.map((time, idx) => (
              <option key={idx} value={time}>{time}</option>
            ))
          )}
        </select>

        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

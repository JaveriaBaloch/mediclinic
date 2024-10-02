import { useState } from 'react';

interface EditAvailabilityModalProps {
    onClose: () => void;
    onSave: (updatedRange: { startDate: Date; endDate: Date }) => void;
    existingRange: { startDate: Date; endDate: Date };
}

const EditAvailabilityModal: React.FC<EditAvailabilityModalProps> = ({ onClose, onSave, existingRange }) => {
    const [startDate, setStartDate] = useState(existingRange.startDate);
    const [endDate, setEndDate] = useState(existingRange.endDate);

    const handleSave = () => {
        onSave({ startDate, endDate });
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Availability</h2>
                <label>
                    Start Date:
                    <input
                        type="datetime-local"
                        value={startDate.toISOString().slice(0, 16)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="datetime-local"
                        value={endDate.toISOString().slice(0, 16)}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                    />
                </label>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditAvailabilityModal;

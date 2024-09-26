import React, { ChangeEventHandler } from "react";
import './style.scss'
interface InputProps {
    placeholder: string;
    onTextChange: ChangeEventHandler<HTMLInputElement>; // Specify that the event handler is for input elements
    type: string;
}

export const InputField: React.FC<InputProps> = ({ placeholder, onTextChange, type }) => {
    return (
        <input
            type={type}
            className="form-control rounded-5 my-1"
            placeholder={placeholder}
            onChange={onTextChange}
        />
    );
};

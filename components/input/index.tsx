import React, { ChangeEventHandler } from "react";
import './style.scss'
interface InputProps {
    name:string
    placeholder: string;
    onTextChange: ChangeEventHandler<HTMLInputElement>; // Specify that the event handler is for input elements
    type: string;
}

export const InputField: React.FC<InputProps> = ({ placeholder, onTextChange, type,name }) => {
    return (
        <input
            type={type}
            className="form-control rounded-5 my-1"
            placeholder={placeholder}
            onChange={onTextChange}
            name={name}
        />
    );
};

import React from "react";
import './style.scss'

interface TextProps{
    icon:string,
    heading:String,
    text:String
}

export const WhyUsCardHomeSection:React.FC<TextProps>=({icon,heading,text})=>{
    return(<div className="card m-3">
        <img className="cardimg" src={icon}/>
        <h3>{heading}</h3>
        <p>{text}</p>
    </div>)
}
import React from "react"
import './style.scss'
interface CardInputProps{
    text:String,
    heading:String,
    img:string
}
export const HompageServiceSectionCard:React.FC<CardInputProps> = ({text,heading,img})=>{
    return(
        <div className="card m-3 p-0" style={{  borderRadius:'10px'}}>
            
            <div className="card-body p-0">
            <img src={img} className="img-fluid p-2" alt="..."/>
                <h5 className="card-title">{heading}</h5>
                <p className="card-text">{text}</p>
            </div>
        </div>
    )
}
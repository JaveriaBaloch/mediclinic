import React from "react"
import './style.scss'
interface headingProps {
    color:string,
    text:String,
    align:string,
}

export const SectionHeadings: React.FC<headingProps> = ({color,text,align})=>{
    return (
        <div className={"d-flex align-items-center "+align} style={{position:'relative',zIndex:1}}>
            <div className="line" style={{background:color}}/>
            <h1 className="text" style={{color}}>{text}</h1>
        </div>
    )
}
import { Icon } from "@/components/icons/icon";
import { SectionHeadings } from "@/components/sectionHeadings";
import { faArrowLeftLong, faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React from "react";
import './style.scss'
export const HomePageHowItWorksSection:React.FC =()=>{
    return(
        <div className="container">
            <SectionHeadings text={"How It Works?"} color={"#006AAC"} align={"justify-content-center"}/>
            <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-8 col-sm-9 mb-5 pb-5">
                <img src="/home/howitworks.svg" alt="" />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-8 col-sm-9">
                    <ol>
                        <li>
                            Create an Account: Sign up for a free account.
                        </li>
                        <li>
                            Search for Providers: Find the healthcare professional you need.
                        </li>
                        <li>
                            Book an Appointment: Schedule a convenient appointment time.
                        </li>
                        <li>
                            Consult Online: Connect with your provider via video or chat.
                        </li>
                    </ol>
                    <Link href='/' className="newlink">
                    <p>Create Account Now</p>
                    <Icon color="#FFFFFF" icon={faArrowRightLong} size="xl"/>
                    </Link>

            </div>
            </div>
        </div>
    )
}
import Link from "next/link"
import { Icon } from "../../icons/icon"
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile"
import './style.scss'
export const BannerHomePage = () =>{
    return(
        <div className="my-t pt-5 container">

            <div className="row d-flex justify-content-between align-items-center">
                <div className="col-xl-5 col-lg-6 col-md-9 col-sm-12">
                    <h1 className="title mb-3">Your Health, Your Choice. Access Care Online.</h1>
                    <p className="para mb-5">Book appointments, find doctors, pharmacies, and hospitals near you.</p>
                    <Link href="/authentication" className="link">
                        <Icon color="#FFFFFF" size="xl" icon={faFile}/>
                        <p>Book Appointment Now</p>
                    </Link>
                </div>
                <div className="col-xl-7 col-lg-6 col-md-0 col-sm-0 d-flex justify-content-end doctor-image-holder">
                    <img src="/home/doctor.png" alt="" className="img mt-5"/>
                </div>
            </div>

        </div>
    )
}
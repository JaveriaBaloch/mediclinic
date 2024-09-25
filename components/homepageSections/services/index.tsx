import { SectionHeadings } from "@/components/sectionHeadings"
import { HompageServiceSectionCard } from "./serviceCard"
import './style.scss'
export const HomePageServicesSection = ()=>{
    return(
        <div className="bg">
            <img src="/home/bg2.svg" alt="" className="bg2" />
            <div className="container">
                <SectionHeadings color={'white'} align={'justify-content-center'} text={'Our Services'}/>
                <div className="d-flex flex-wrap justify-content-center align-items-center my-5">
                    <HompageServiceSectionCard text={'Connect with doctors for virtual appointments.'} heading={'Online Consultations'} img="/home/servicecard1.png"/>
                    <HompageServiceSectionCard text={'Refill your prescriptions easily and securely.'} heading={'Prescription Refills'} img="/home/servicecard2.png"/>
                    <HompageServiceSectionCard text={'Search for doctors, pharmacies, and hospitals in your area.'} heading={'Find Healthcare Providers'} img="/home/servicecard3.png"/>
                    <HompageServiceSectionCard text={'Access educational materials and health tips.'} heading={'Health Resources'} img="/home/servicecard4.png"/>

                </div>
            </div>
        </div>
    )
}
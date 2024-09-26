import { Icon } from "@/components/icons/icon"
import { SectionHeadings } from "@/components/sectionHeadings"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { TestimonialCard } from "./TestimonialCards"
import './style.scss'
export const HomePageTestimonialsSection = () =>{
    return(
        <div id="testinomials">
            <img src="/home/testimonials.svg" alt="" className="bg1" />
            <div className="container">
                <SectionHeadings  color="#006AAC" text={'Testimonials'} align="flex-start"/>
                <div className="testimonials">
                    <div className="icon">
                        <Icon color="#006AAC" icon={faArrowLeft} size="xl"/>
                    </div>
                    <div className="list">
                       <TestimonialCard img="/home/image.png" name="Ahmed Sohail" text="“I love being able to consult with my doctor from the comfort of my home. It's so convenient!”" rating={3}/>
                    </div>
                    <div className="icon">
                        <Icon color="#006AAC" icon={faArrowRight} size="xl"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
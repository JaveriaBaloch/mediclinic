import { SectionHeadings } from '@/components/sectionHeadings'
import './style.scss'
import { WhyUsCardHomeSection } from './cards'
import { faSmog } from '@fortawesome/free-solid-svg-icons'
export const WhyUsHomeSection = ()=>{
    return(
        <div className="why-us">
            <img src='/home/bg1.svg' className='bg-img'/>
            <div className="container">
                <SectionHeadings color={'#006AAC'} align={'flex-start'} text={'Why Choose Us?'}/>
                <div className="d-flex justify-content-center align-items-center flex-wrap my-5">
                    <WhyUsCardHomeSection  icon={'/home/whycard1.png'} heading={'Efficiency'} text={'Reduce wait times and streamline your healthcare experience.'}/>
                    <WhyUsCardHomeSection  icon={'/home/whycard2.png'} heading={'Convenience'} text={'Book appointments from the comfort of your home.'}/>

                    <WhyUsCardHomeSection  icon={'/home/whycard3.png'} heading={'Security'} text={'Your health information is protected with the latest security measures.'}/>
                    <WhyUsCardHomeSection  icon={'/home/whycard4.png'} heading={'Accessibility'} text={'Connect with healthcare professionals anytime, anywhere.'}/>

                </div>
            </div>
        </div>
    )
}
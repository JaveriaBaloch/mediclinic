import { DoctorsCard } from "@/components/doctorsCard"
import { SectionHeadings } from "@/components/sectionHeadings"
import './style.scss'
export const HomepageFeaturedDoctorsSection = ()=>{
    return (
        <div id="FeaturedDoctorsSection">
            <div className="container">
            <SectionHeadings color="#006AAC" text={"Featured Providers"} align="flex-start"/>

                <div className="list d-flex flex-wrap justify-content-center align-items-center">
               { Array.from({ length: 5 }, (_, i) =>
                (
                    <DoctorsCard 
                    img="/home/image.png"
                    name="Noah Smith"
                    specialization="Endocrinologist"
                    id={i}
                    />
               )
            )
            } 
                </div>
            </div>
        </div>
    )
}
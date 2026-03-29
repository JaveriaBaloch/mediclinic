import Link from "next/link"
import { SectionHeadings } from "../sectionHeadings"
import './style.scss'
import { Icon } from "../icons/icon"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import Image from 'next/image';

export const HomePageContactUsSection = () => {
    return (
        <div id="ContactUsSection">
            <Image
                src="/home/contactusbg.svg"
                alt=""
                className="bg1"
                fill
                style={{ objectFit: 'cover' }}
            />
            <div className="container">
                <SectionHeadings color="#FFFFFF" text={'Contact Us'} align="justify-content-center" />
                <form>
                    <input type="text" className="form-control rounded-5" placeholder="Name" />
                    <input type="email" className="form-control rounded-5" placeholder="Email" />
                    <textarea className="form-control rounded-5" placeholder="Message" cols={10} rows={10}></textarea>
                    <Link href='/' className="newlink my-5">
                        <p className="me-3 text-white para">Submit Message</p>
                        <Icon color="#FFFFFF" icon={faArrowRightLong} size="xl" />
                    </Link>
                </form>
            </div>
        </div>
    )
}
import Navbar from "@/components/navbar"
import styles from "../page.module.css";
import { FooterSection } from "@/components/Footer";
import Link from "next/link";

const Doctors = ()=>{
    return (
        <section id="Doctors">
            <Navbar activeItem={1}/>
            <FooterSection/>
            <Link href={'/DoctorLogin'} className={styles.fixedbtn}>
                <p>
                    Join as a Doctor
                </p>
            </Link>
        </section>
    )
}
export default Doctors
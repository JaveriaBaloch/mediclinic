import Navbar from "@/components/navbar"
import styles from "../page.module.css";
import { FooterSection } from "@/components/Footer";
import Link from "next/link";

const Pharmacy = ()=>{
    return (
        <section id="Doctors">
            <Navbar activeItem={2}/>
            <FooterSection/>
            <Link href={'/doctorAccountCreation'} className={styles.fixedbtn}>
                <p>
                    Join as a Doctor
                </p>
            </Link>
        </section>
    )
}
export default Pharmacy
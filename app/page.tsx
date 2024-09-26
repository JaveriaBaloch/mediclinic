'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";
import { BannerHomePage } from "@/components/homepageSections/banner.tsx";
import { WhyUsHomeSection } from "@/components/homepageSections/WhyUS";
import { HomePageServicesSection } from "@/components/homepageSections/services";
import { HomePageHowItWorksSection } from "@/components/homepageSections/HowItWorks";
import { HomePageTestimonialsSection } from "@/components/homepageSections/Testimonials";
import { HomepageFeaturedDoctorsSection } from "@/components/homepageSections/DoctorsSection";
import { HomePageContactUsSection } from "@/components/contactus";
import { FooterSection } from "@/components/Footer";
import Link from "next/link";
export default function Home() {
  return (
    <main >
      <section id="Home">
        <Navbar activeItem={0}/>
        <BannerHomePage/>
        <WhyUsHomeSection/>
        <HomePageServicesSection/>
        <HomePageHowItWorksSection/>
        <HomePageTestimonialsSection/>
        <HomepageFeaturedDoctorsSection/>
        <HomePageContactUsSection/>
        <FooterSection/>
        <Link href={'/DoctorLogin'} className={styles.fixedbtn}>
        <p>
        Join as a Doctor
        </p>
        </Link>
      </section>
    </main>
  );
}

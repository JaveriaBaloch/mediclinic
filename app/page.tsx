'use client';
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
import { HomePageHealthTipSection } from "@/components/homepageSections/HomePageHealthTipSection";
import { DoctorsHomeBanner } from "@/components/DoctorsHomeBanner";

export default function Home() {
  const role = sessionStorage.getItem("role");

  return (
    <main>
      <section id="Home">
        <Navbar activeItem={0} />
        {role === null && (
          <>
            <BannerHomePage />
            <WhyUsHomeSection />
            <HomePageServicesSection />
            <HomePageHowItWorksSection />
            <HomePageTestimonialsSection />
           
            <HomePageContactUsSection />
          </>
        )}
        {role === 'patient' && 
        <>
        <HomePageHealthTipSection />
        <HomepageFeaturedDoctorsSection />
        </>
        }
        {
          role == 'doctor'&&
          <>
          <DoctorsHomeBanner/>
          </>
        }
        <FooterSection />

        {role === null && (
          <Link href="/doctorAccountCreation" className={styles.fixedbtn}>
            <p>Join as a Doctor</p>
          </Link>
        )}
      </section>
    </main>
  );
}

'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";
import { BannerHomePage } from "@/components/homepageSections/banner.tsx";
import { WhyUsHomeSection } from "@/components/homepageSections/WhyUS";
import { HomePageServicesSection } from "@/components/homepageSections/services";
import { HomePageHowItWorksSection } from "@/components/homepageSections/HowItWorks";
export default function Home() {
  return (
    <main >
     <Navbar/>
     <BannerHomePage/>
     <WhyUsHomeSection/>
     <HomePageServicesSection/>
     <HomePageHowItWorksSection/>
    </main>
  );
}

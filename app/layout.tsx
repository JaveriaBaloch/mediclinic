import type { Metadata } from "next";
import { Manrope} from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech.Care",
  description: "Generated by create next app",
  icons:['/images/icon.png']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{backgroundColor:'#F6F7F8'}}>
      <body style={{backgroundColor:'#F6F7F8'}}>{children}</body>
    </html>
  );
}

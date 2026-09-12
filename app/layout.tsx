
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {DataProvider} from "@/context/DataProvider"
import toast, { Toaster } from 'react-hot-toast';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sscar: Secodary School Continuous Assessment report",
  description: "A mini application for analysing Uganda 'O' level compitent base carriculum student scores",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider >
          <Toaster />
          {children}
        </DataProvider>
      </body>
    </html>
  );
}

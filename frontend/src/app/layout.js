import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
  });

  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
  });

export const metadata = {
  title: "Asistente de Carrera Profesional",
  description:
    "Plataforma de orientación profesional para estudiantes de Ingeniería de Software de Datos, proporcionando guías personalizadas sobre especializaciones en Ingeniería de Datos, Ciencia de Datos y áreas afines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

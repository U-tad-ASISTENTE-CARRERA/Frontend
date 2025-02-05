import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>Mi Aplicación Next.js</title>
      </Head>
      <div>Bienvenido al asistente de carrera de U-tad</div>
    </>
  );
}

import Navbar from "@/components/navbar";
import Overlay from "@/components/overlay";
import Hero from "@/components/hero";
import Divisions from "@/components/divisions";

export default function Home() {
  return (
    <>
      <Overlay />
      <Navbar />
      <Hero />
      <Divisions />
    </>
  );
}
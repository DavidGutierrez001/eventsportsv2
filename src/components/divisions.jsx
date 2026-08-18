"use client";

import { ArrowRight } from 'lucide-react';

export default function Divisions() {

    const cardDivisions = [
        {
            id: 1,
            title: "NATACIÓN",
            image: "natacion.webp"
        },
        {
            id: 2,
            title: "MARATÓN",
            image: "maraton.webp",
        },
        {
            id: 3,
            title: "CICLISMO",
            image: "ciclista.webp"
        },
    ]

    return (
        <>
            <section className='bg-events w-full min-h-svh flex flex-col justify-center items-center relative'>
                <div className="flex flex-col justify-center items-center md:flex-row relative min-h-[clamp(90svh,90vh,90svh)] w-full pt-20 pb-10 lg:max-w-[80vw] px-5 md:px-10 overflow-hidden md:overflow-visible">
                    <div className="flex-1 order-2 md:order-1 justify-end items-center flex">
                        <img
                            src="higuita.webp"
                            alt="rene higuita"
                            className="h-[clamp(25rem,50vw,50rem)] md:h-[75svh] -right-22 md:right-auto object-cover absolute bottom-22 md:bottom-0 md:translate-x-20 lg:translate-x-20 z-10 pointer-events-none"
                        />
                    </div>

                    <div className="flex-1/3 flex flex-col justify-center order-1 md:order-2 ">
                        <h2 className="font-bebas font-bold leading-none text-[clamp(4.5rem,7.2vw,7.2rem)] tracking-wide">
                            DESCUBRE EVENTOS
                        </h2>
                        <p className="text-[clamp(1rem,2.5vw,1.4rem)] text-white/80 mb-5 font-light">
                            Ahora podrás ver y participar en todos los eventos deportivos que encuentras alrededor de tu zona en un solo lugar.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden">
                            {cardDivisions.map((division) => (
                                <div key={division.id} className="h-100 md:h-100 lg:h-[50svh] rounded overflow-hidden relative">
                                    <img
                                        className="object-cover h-full w-full"
                                        src={division.image}
                                        alt={division.title}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 h-13 flex items-center justify-center backdrop-blur-xs">
                                        <span className="text-white text-2xl tracking-wider font-bebas font-light">{division.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="flex items-center justify-center md:justify-center gap-2 bg-white/80 hover:bg-[#8bdac3] text-black font-semibold md:text-normal p-4 mt-7 rounded cursor-not-allowed text-sm md:text-lg z-20 md:z-0">
                            EXPLORAR MÁS
                            <ArrowRight height="1.5em" className='text-black' />
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}
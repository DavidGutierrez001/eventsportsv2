"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Menu } from "lucide-react";

import Link from "next/link";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={'fixed w-screen top-0 flex h-20 items-center px-5 md:px-8 backdrop-blur-xs z-20 justify-around'}>

            <div className="flex items-center justify-start">
                <a href="/" rel="noopener noreferrer">
                    <Image
                        src="/eventsports.svg"
                        alt="Logo"
                        width={115}
                        height={30}
                        className="cursor-pointer"
                    />
                </a>
            </div>

            <div className="hidden md:flex items-center justify-center gap-6">
                <ul className="flex items-center gap-10 text-sm text-white/80 font-light">
                    <li><Link href="/" className="hover:text-white transition-colors">INICIO</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors">EVENTOS</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors">NOTICIAS</Link></li>
                </ul>
            </div>

            <div className="flex items-center justify-end">
                <button
                    className="flex md:hidden cursor-pointer items-center gap-2 p-1 hover:bg-black/20 rounded font-light transition-colors text-white"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu className="order-1" height="3em" />
                    <span className="order-0">MENÚ</span>
                </button>
                <Link href="/login" className="relative overflow-hidden login-selected py-1 text-white/90 hover:text-white hidden md:flex">
                    <span className="cursor-pointer font-light">
                        Iniciar sesión
                    </span>
                </Link>
            </div>
            <div
                onClick={() => setIsMenuOpen(false)}
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-20
                    ${isMenuOpen ? "pointer-events-auto opacity-100 backdrop-blur-lg" : "pointer-events-none opacity-0"}`
                }
            />

            <div
                className={`fixed inset-y-0 left-0 z-30 flex h-screen w-full max-w-150 flex-col bg-white transition-transform duration-300 ease-in-out 
                    ${isMenuOpen ? "" : "-translate-x-full"}`
                }
            >
                <div className="flex items-center justify-between p-[clamp(1rem,2vw,2rem)] relative">
                    <a href="/" rel="noopener noreferrer">
                        <Image
                            src="/eventsports-black.svg"
                            alt="Logo"
                            width={130}
                            height={130}
                            className="cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </a>
                    <button
                        className="cursor-pointer rounded-full p-2 transition-colors hover:bg-black/10"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size="2em" color="#000" />
                    </button>
                </div>

                <ul className="flex flex-col relative px-5 md:px-10 text-[clamp(1rem,1.2vw,1.3rem)] text-accent/50 font-semibold">
                    <li className="item_menu item_selected"><a href="/">INICIO</a></li>
                    <li className="item_menu"><a href="/about">EVENTOS</a></li>
                    <li className="item_menu"><a href="/divisions">DIVISIONES</a></li>
                    <li className="item_menu"><a href="/contact">NOTICIAS</a></li>
                </ul>
            </div>
        </nav>
    );
}
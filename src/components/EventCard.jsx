"use client";

import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function EventCard({ event, onClick, variant = "outline" }) {
    const ghost = variant === "ghost";
    const { theme } = useTheme();

    return (
        <Button
            onClick={onClick}
            variant="none"
            className="relative animate-in fade-in duration-500 h-115 w-70 md:w-80 overflow-hidden bg-black">
            {event.imagen_url ? (
                <img
                    src={event.imagen_url}
                    alt={`${event.nombre} - Imagen`}
                    className={`w-full h-full absolute object-cover inset-0 transition-all hover:scale-105 duration-400
                        ${theme === "light" ? "" : "opacity-90"}`}
                />
            ) : (
                <ImageOff className="size-20 text-white/50" strokeWidth={0.7} />
            )}

            <div className="flex flex-col absolute bottom-0 right-0 h-20 items-center justify-center text-white pointer-events-none bg-black/50 backdrop-blur-sm w-full">
                <h2 className="text-[clamp(1.1rem,1.12vw,1.12rem)] text-shadow capitalize font-light">{event.nombre.toLowerCase()}</h2>
                <p className="text-xs font-light">{event.fecha ? new Date(event.fecha).toLocaleDateString() : "Fecha por definir"}</p>
            </div>

        </Button>
    );
}

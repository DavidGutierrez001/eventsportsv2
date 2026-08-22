"use client";

import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";

export default function EventCard({ event, onClick, variant = "outline" }) {
    const ghost = variant === "ghost";

    return (
        <Button
            onClick={onClick}
            variant={ghost ? "ghost" : "outline"}
            className={ghost
                ? "relative animate-in fade-in duration-500 h-100 w-80 overflow-hidden"
                : "relative border flex-1 min-w-80 max-w-80 h-100 p-3 rounded-md overflow-hidden"}>
            {event.imagen_url ? (
                <img
                    src={event.imagen_url}
                    alt={`${event.nombre} - Imagen`}
                    className={ghost
                        ? "absolute h-full inset-0 opacity-50 transition-opacity hover:opacity-80 object-cover"
                        : "absolute object-cover inset-0 opacity-50 transition-opacity hover:opacity-100"}
                />
            ) : (
                <ImageOff className="size-20 text-white/50" strokeWidth={0.7} />
            )}
            {ghost ? (
                <div className="flex flex-col gap-5 absolute bottom-0 right-0 w-full p-5">
                    <h2 className="text-xl">{event.nombre}</h2>
                    <p className="text-xs">{event.fecha ? new Date(event.fecha).toLocaleDateString() : "Fecha por definir"}</p>
                </div>
            ) : (
                <>
                    <span className="absolute top-3 left-3 text-xl font-light">{event.nombre}</span>
                    <span className="absolute bottom-3 left-3 text-xs">
                        {event.fecha ? new Date(event.fecha).toLocaleDateString() : "Fecha por definir"}
                    </span>
                </>
            )}
        </Button>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getEvents } from "@/services/eventsServices";
import { useAuth } from "@/context/AuthContext";
import EventDetailDialog from "@/components/EventDetailDialog";
import EventCard from "@/components/EventCard";
import LoginForm from "@/components/LoginForm";

function crearSlug(categoria) {
    if (!categoria) return "";
    return categoria
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export default function DetalleEvento({ params }) {
    const [slug, setSlug] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openEvent, setOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openRegister, setOpenRegister] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
        });
    }, [params]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Error al conectar con la API:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    const eventosFiltrados = events.filter(
        (event) => crearSlug(event.categoria) === slug
    );

    return (
        <div className="p-5">
            {loading && (
                <div className="flex gap-5 justify-start w-full animate-in fade-in-0">
                    {Array.from({ length: 1 }).map((_, index) => (
                        <Skeleton key={index} className="w-80 h-100 p-3 rounded-none"></Skeleton>
                    ))}
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-self-start">
                    {eventosFiltrados.length > 0 ? (
                        eventosFiltrados.map((event) => (
                            <EventCard
                                key={event._id}
                                variant="ghost"
                                event={event}
                                onClick={() => {
                                    setSelectedEvent(event);
                                    setOpenEvent(true);
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-3">
                            No hay eventos disponibles para esta categoría actualmente.
                        </p>
                    )}
                </div>
            )}

            <EventDetailDialog
                event={selectedEvent}
                open={openEvent}
                onOpenChange={setOpenEvent}
                onRequireAuth={() => setOpenRegister(true)}
            />

            {!isAuthenticated ? (
                <Dialog open={openRegister} onOpenChange={setOpenRegister}>
                    <DialogContent className="max-h-150! h-full">
                        <div className="flex flex-col justify-around items-center">
                            <LoginForm />
                        </div>
                    </DialogContent>
                </Dialog>
            ) : null}
        </div>
    );
}

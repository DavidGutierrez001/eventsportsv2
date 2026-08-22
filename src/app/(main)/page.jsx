"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import LoginForm from "@/components/LoginForm";
import { Dialog, DialogContent, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/context/AuthContext"
import { getEvents } from "@/services/eventsServices"
import EventDetailDialog from "@/components/EventDetailDialog"
import EventCard from "@/components/EventCard";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [openEvent, setOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openRegister, setOpenRegister] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            setOpenRegister(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
            setLoading(false);
        };

        fetchEvents();
    }, []);

    const eventosPorCategoria = events?.reduce((acc, event) => {
        const categoria = event.categoria || "No hay categorías";
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(event);
        return acc;
    }, {});

    return (
        <div className="p-5 gap-5 relative min-h-[calc(100svh-77px)]">
            <div className="flex flex-col gap-5">
                {loading && (
                    <section className="flex flex-col gap-3">
                        <Skeleton className="text-xl font-bold h-5 w-30 animate-in fade-in-0 duration-300"></Skeleton>
                        <div className="flex gap-5 justify-self-start w-full animate-in fade-in-0 duration-300">
                            {Array.from({ length: 1 }).map((_, index) => (
                                <Skeleton key={index} className="w-80 h-117 p-3 rounded-none"></Skeleton>
                            ))}
                        </div>
                    </section>
                )}

                {events && (
                    Object.entries(eventosPorCategoria).map(([nombreCategoria, listaEventos]) => (
                        <section key={nombreCategoria} className="flex flex-col gap-3">
                            <h1 className="text-xl">{nombreCategoria}</h1>
                            <div className="flex gap-5 justify-self-start animate-in fade-in-0 duration-300 mb-5 overflow-auto">
                                {listaEventos.map((event) => (
                                    <EventCard
                                        key={event._id}
                                        variant="ghost"
                                        event={event}
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setOpenEvent(true);
                                        }}
                                    />
                                ))}
                            </div>
                            <Separator />
                        </section>
                    ))
                )}
            </div>

            <EventDetailDialog
                event={selectedEvent}
                open={openEvent}
                onOpenChange={setOpenEvent}
                onRequireAuth={() => setOpenRegister(true)}
            />

            {!isAuthenticated ? (
                <Dialog open={openRegister} onOpenChange={setOpenRegister}>
                    <DialogContent className="max-h-140! max-w-100! h-full">
                        <div className="flex flex-col justify-around items-center">
                            <LoginForm />
                        </div>
                    </DialogContent>
                </Dialog>
            ) : null}
        </div>
    )
}

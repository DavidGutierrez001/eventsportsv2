"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ClipboardPen, ImageOff, } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToEvent, getMySubscriptions } from "@/services/eventsServices";
import { toast } from "@/components/ui/toast";

export default function EventDetailDialog({ event, open, onOpenChange, onRequireAuth, readOnly = false }) {
    const { isAuthenticated } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!readOnly && isAuthenticated && open) {
            getMySubscriptions().then(setSubscriptions).catch(() => { });
        }
    }, [isAuthenticated, open, readOnly]);

    if (!event) return null;

    const isSubscribed = subscriptions.some(
        (sub) => sub.evento_id === (event._id || event.id)
    );

    async function handleSubscribe() {
        if (!isAuthenticated) {
            onOpenChange(false);
            onRequireAuth?.();
            return;
        }
        if (isSubscribed) {
            toast.add({
                title: "Ya estás inscrito",
                description: `Ya tienes una inscripción activa en ${event.nombre}.`,
                variant: "warning",
            });
            onOpenChange(false);
            return;
        }
        try {
            setLoader(true);
            await subscribeToEvent(event._id || event.id);
            const newSub = await getMySubscriptions();
            setSubscriptions(newSub);
            toast.add({
                title: "Inscripción exitosa",
                description: `Te inscribiste en ${event.nombre}`,
                variant: "success",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error al inscribirse en el evento:", error);
            toast.add({
                title: "Error al inscribirse",
                description: error.message || "Intenta de nuevo más tarde",
                variant: "error",
            });
        } finally {
            setLoader(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col md:flex-row max-w-200! md:max-w-250 max-h-140! h-full w-[calc(100%-2rem)]">
                <div className="w-full overflow-hidden rounded shadow-xl flex justify-center items-center flex-1">
                    {event.imagen_url ? (   
                        <img
                            className="object-cover w-full h-full"
                            src={event.imagen_url}
                            alt={event.nombre}
                        />
                    ) : (
                        <ImageOff size={100} strokeWidth={0.7} />
                    )}
                </div>
                <div className="flex flex-col w-full gap-5 flex-1">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{event.nombre}</DialogTitle>
                    </DialogHeader>
                    <div className="h-full font-light text-[1rem] rounded w-full flex flex-col">
                        <p>{event.descripcion || "No se ha encontrado descripción"}</p>
                    </div>
                    <div className="flex mt-auto justify-end items-center font-light text-xs gap-3">
                        <span className="bg-background/20 p-1 rounded px-3">{event.lugar}</span>
                        <Separator orientation="vertical" />
                        <span className="bg-background/20 p-1 rounded px-3">Inscritos: {event.inscritos || 0} / {event.cupo_maximo}</span>
                    </div>
                    <Separator />
                    <DialogFooter className="flex-row! font-light justify-between! items-center mt-auto">
                        <span>Comienza el: {new Date(event.fecha).toLocaleDateString("es-ES")}</span>
                        {!readOnly && (isSubscribed ? (
                            <Button type="button" variant="outline" disabled>
                                <CheckCircle />
                                Evento inscrito
                            </Button>
                        ) : (
                            <Button onClick={handleSubscribe} type="button">
                                {loader ? <Spinner /> : <ClipboardPen />}
                                Inscribir evento
                            </Button>
                        ))}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

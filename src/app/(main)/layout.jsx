"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EventsSidebar } from "@/components/EventsSidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link";
import { getEvents, getMySubscriptions, cancelSubscription } from "@/services/eventsServices"
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Trash, SquareArrowOutUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }) {
    const pathname = usePathname();
    const { user, logout, isAuthenticated, load, userRol } = useAuth();
    const [openSubscriptions, setOpenSubscriptions] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
    const [events, setEvents] = useState([]);


    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    async function openMySubscriptions() {
        setLoadingSubscriptions(true);
        setOpenSubscriptions(true);
        try {
            const data = await getMySubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error("Error al obtener inscripciones:", error);
            toast.add({
                title: "Error",
                description: "No se pudieron cargar las inscripciones.",
                variant: "error",
            });
        } finally {
            setLoadingSubscriptions(false);
        }
    }

    async function handleCancelSubscription(eventId) {
        try {
            await cancelSubscription(eventId);
            setSubscriptions((prev) => prev.filter((sub) => sub.evento_id !== eventId));
            toast.add({
                title: "Inscripción cancelada",
                description: "Te has desinscrito del evento.",
                variant: "success",
            });
        } catch (error) {
            console.error("Error al cancelar inscripción:", error);
            toast.add({
                title: "Error",
                description: error.message || "No se pudo cancelar la inscripción.",
                variant: "error",
            });
        }
    }

    return (
        <SidebarProvider>
            <EventsSidebar />
            <div className="flex-1 max-w-screen overflow-x-hidden">
                <header className="flex relative items-center h-15 border-b justify-between px-3">
                    <SidebarTrigger />
                    <span className="absolute left-1/2 -translate-x-1/2 text-sm text-foreground font-medium">{pathname.slice(1).toUpperCase().split('/')[1] || "EVENTOS"}</span>
                    {load ? (
                        <div className="flex gap-1 items-center">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="gap-1 flex flex-col">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Skeleton key={index} className="h-2 w-30 rounded" />
                                ))}
                            </div>
                        </div>
                    ) : user ? (
                        <div className="flex text-accent-foreground gap-3 items-center text-sm">
                            <DropdownMenu>
                                <DropdownMenuTrigger render={<Button variant="ghost" />}>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                    </Avatar>
                                    <div className="flex flex-col items-start text-left ml-2 text-xs font-light">
                                        <span>{user.nombre}</span>
                                        <span className="text-accent-foreground/40">{user.email}</span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={openMySubscriptions}>Mis inscripciones</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    {userRol === "admin" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Administración</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    render={
                                                        <Link href="/dashboard">
                                                            Panel
                                                            <SquareArrowOutUpRight />
                                                        </Link>
                                                    }>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                logout();
                                            }}>
                                            Cerrar sesión
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex gap-3 text-sm justify-center items-center">
                            <Link href="/login">
                                <Button variant="ghost" className="text-secondary-foreground font-light hover:text-white">
                                    Iniciar sesión
                                </Button>
                            </Link>
                            <Separator orientation="vertical" />
                            <Link href="/register">
                                <Button className="px-5" variant="default">
                                    Registrarse
                                </Button>
                            </Link>
                        </div>
                    )}
                </header>

                <div className="p-5">
                    {load ? (
                        <>
                            <Skeleton className="h-70 w-full" />
                        </>
                    ) : !isAuthenticated ? (
                        <>
                            {!isAuthenticated && (
                                <div className="w-full relative animate-in fade-in duration-1000">
                                    <img
                                        src="/banner-welcome.svg"
                                        alt="banner bienvenida"
                                        className="object-cover w-full h-70"
                                    />
                                    <div className="absolute top-0 left-0 p-3 gap-5 w-full h-full flex flex-col justify-center items-center">
                                        <h1 className="font-open-sauce text-6xl opacity-80 tracking-tighter">
                                            Inscríbete a los eventos
                                        </h1>
                                        <p className="max-w-200 text-center text-lg">
                                            No te pierdas la oportunidad de participar en los eventos más emocionantes. Explora, elige y asegura tu cupo en la acción para no olvidar lo que está pendiente.
                                        </p>

                                        <Link href="/register">
                                            <Button variant="default" className="h-12 px-10">
                                                Registrate ahora
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>)
                        : null
                    }
                </div>

                {children}

                <Dialog open={openSubscriptions} onOpenChange={setOpenSubscriptions}>
                    <DialogContent className="max-h-150! max-w-200! w-full h-full flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Mis inscripciones</DialogTitle>
                            <DialogDescription>Aqui puedes ver todas tus inscripciones que tienes activas.</DialogDescription>
                        </DialogHeader>
                        {loadingSubscriptions ? (
                            <div className="flex justify-center py-10">
                                <Spinner />
                            </div>
                        ) : subscriptions.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">
                                No tienes inscripciones activas.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3 max-h-100 overflow-auto">
                                {subscriptions.map((sub) => {
                                    const event = events.find((e) => e._id === sub.evento_id);
                                    return (
                                        <div key={sub._id} className="flex items-center justify-around border rounded p-3 relative">
                                            <div className="flex flex-col justify-center h-30">
                                                <span className="text-lg font-light">{event?.nombre || sub.evento_id}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    Inscrito el: {new Date(sub.fecha_inscripcion).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <img
                                                src={event?.imagen_url || "/default-image.jpg"}
                                                alt="foto del evento"
                                                className="h-full grayscale-50 opacity-10 left-0 w-full absolute object-cover -z-10"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleCancelSubscription(sub.evento_id)}>
                                                    <Trash />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </SidebarProvider>
    )
}

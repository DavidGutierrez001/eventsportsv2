import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getEvents } from "@/services/eventsServices"
import { getCategoryIcon, slugifyCategoria } from "@/lib/categoryIcons"
import { useTheme } from "@/context/ThemeContext";

export function EventsSidebar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname()
    const newpathname = pathname.split('/');
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
        try {
            setLoading(true);
            const fetchEvents = async () => {
                const data = await getEvents();
                setEvents(data);
            };
            fetchEvents();
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener categorías únicas de los eventos
    const categorias = [...new Set(events.map((e) => e.categoria).filter(Boolean))];

    return (
        <>
            <Sidebar>
                <SidebarHeader />
                <SidebarContent className="px-3">
                    <SidebarGroup>
                        <div className="flex justify-center items-center pb-5">
                            {mounted ? (
                                <img src={theme === "light" ? "/evsite-black.svg" : "/evsite.svg"} alt="logo" className="h-6" />
                            ) : (
                                <div className="h-6 w-20" />
                            )}
                        </div>
                        <SidebarGroupLabel>Principal</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className={pathname === '/' ? 'pointer-events-none' : ''}
                                    isActive={pathname === '/'}
                                    render={<Link href={`/`}>Eventos</Link>}>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                    <Separator />
                    <SidebarGroup>
                        <SidebarGroupLabel>Categorias</SidebarGroupLabel>
                        <SidebarMenu>
                            {loading ? (
                                Array.from({ length: 15 }).map((_, index) => (
                                    <SidebarMenuItem key={`skeleton-${index}`}>
                                        <div className="px-3 py-2">
                                            <Skeleton className="h-4 w-full rounded" />
                                        </div>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                categorias.map((categoria) => {
                                    const slug = slugifyCategoria(categoria);
                                    const Icon = getCategoryIcon(categoria);
                                    return (
                                        <SidebarMenuItem className="animate-in fade-in duration-300" key={slug}>
                                            <SidebarMenuButton
                                                className={pathname === `/eventos/${slug}` ? 'pointer-events-none pl-3' : 'opacity-80'}
                                                isActive={newpathname[2] === slug}
                                                render={<Link href={`/eventos/${slug}`} />}
                                            >
                                                <Icon />
                                                <span>{categoria}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                    <Separator />
                </SidebarContent>
            </Sidebar>
        </>
    )
}
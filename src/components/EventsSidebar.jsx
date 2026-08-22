import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvents } from "@/services/eventsServices"

export function EventsSidebar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname()
    const newpathname = pathname.split('/');

    useEffect(() => {
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
                <SidebarContent>
                    <SidebarGroup>
                        <div className="flex justify-center items-center pb-5">
                            <img src="/evsite.svg" alt="logo" className="w-20" />
                        </div>
                        <SidebarGroupLabel>Principal</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className={pathname === '/' || pathname === '/' ? 'pointer-events-none' : ''}
                                    isActive={pathname === '/' || pathname === '/'}
                                    render={<Link href={`/`}>Eventos</Link>}>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
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
                                    const slug = categoria.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
                                    return (
                                        <SidebarMenuItem className="animate-in fade-in duration-300" key={slug}>
                                            <SidebarMenuButton
                                                className={pathname === `/eventos/${slug}` ? 'pointer-events-none pl-3' : 'opacity-80'}
                                                isActive={newpathname[2] === slug}
                                                render={<Link href={`/eventos/${slug}`}>{categoria}</Link>}>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </>
    )
}
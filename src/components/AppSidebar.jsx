"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// shadcn Componentes
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, SidebarMenu, } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Context
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

// Iconos
import { Calendar, User, Settings, LogOut } from 'lucide-react';

function AvatarWithBadge() {
    return (
        <Avatar className="size-8">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-md" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
    );
}


export function AppSidebar() {
    const { theme } = useTheme();
    const { user, logout } = useAuth();

    const items = [
        {
            section: "Gestión",
            items: [
                {
                    label: "Eventos",
                    path: "/dashboard/eventos",
                    icon: <Calendar className="size-4" />,
                    beta: true,
                    disabled: false,
                },
            ],
        },
    ];

    const pathname = usePathname()
    const router = useRouter()

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        setLogoutDialogOpen(false);
        logout();
        router.push("/login");
    }

    const logodark = "/evsite-black.svg";
    const logolight = "/evsite.svg";

    return (

        <Sidebar id="sidebar-trigger">
            <SidebarHeader className="flex flex-col items-center justify-center my-7">
                {theme === "light" ? (
                    <img src={logodark} className="h-6" alt="Logo" />
                ) : (
                    <img src={logolight} className="h-6" alt="Logo" />
                )}
            </SidebarHeader>
            <Separator />
            <SidebarContent className="px-3">
                {items.map((section, index) => (
                    <div key={section.section}>
                        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                            <SidebarGroupLabel>{section.section}</SidebarGroupLabel>

                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton
                                            render={
                                                <Link
                                                    href={item.path}
                                                    className={item.disabled ? "pointer-events-none opacity-50" : ""}
                                                />
                                            }
                                            isActive={pathname === item.path}
                                            size="xs"
                                            className={pathname === item.path ? "pointer-events-none" : ""}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>

                                            {item.beta && (
                                                <Badge variant="outline" className="ml-auto px-2 font-medium">
                                                    Beta
                                                </Badge>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>

                        {index !== items.length - 1 && <Separator />}
                    </div>
                ))}
            </SidebarContent>

            <Separator />

            <SidebarFooter className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<Button variant="ghost" type="button" className="h-12 w-full justify-start rounded-md" />}
                            >
                                <AvatarWithBadge />
                                <div className="flex flex-col items-start justify-center">
                                    <span>{user?.nombre || "Usuario"}</span>
                                    <span className="text-xs text-foreground/50">
                                        {user?.email || "usuario@email.com"}
                                    </span>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent side="top" align="center" className="flex flex-col p-3">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Sesión
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)} variant="destructive">
                                        <LogOut />
                                        Cerrar sesion
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>

                    <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>¿Seguro que quieres cerrar sesión?</DialogTitle>
                                <DialogDescription>
                                    Deberás iniciar sesión nuevamente para acceder a tu cuenta.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-3">
                                <DialogClose>
                                    Cancelar
                                </DialogClose>
                                <Button variant="destructive" onClick={handleLogout}>
                                    Cerrar sesión
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}
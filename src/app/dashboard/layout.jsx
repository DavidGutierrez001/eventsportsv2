"use client";

import * as React from "react";
import Link from "next/link";

// shadcn Componentes
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTrigger } from "@/components/ui/popover"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "@/components/ui/toast"
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"

// Iconos
import { Bell, ArrowLeft } from "lucide-react";

export default function RootLayout({ children }) {

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "18rem",
                "--sidebar-width-mobile": "20rem",
            }}
        >
            <AppSidebar />

            <SidebarInset>
                <DashboardHeader />

                <Separator />

                <main className="flex flex-col gap-5 p-5 lg:p-7 h-full min-h-[calc(100svh-77px)]">
                    <Link href="/" className="w-fit">
                        <Button variant="outline">
                            <ArrowLeft />
                            Regresar
                        </Button>
                    </Link>
                    {children}
                </main>

                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}

function DashboardHeader() {
    return (
        <header id="header-dashboard" className="flex items-center px-7 py-5 gap-5 justify-between">
            <div className="flex gap-3 items-center">
                <SidebarTrigger />

                <Separator orientation="vertical" />

                <BreadCrumb />
            </div>
            <div className="flex gap-3">
                <NotificationsPopover />
                <ModeToggle />
            </div>
        </header>
    );
}

function NotificationsPopover() {
    return (
        <Popover>
            <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Abrir notificaciones" />}>
                <Bell />
            </PopoverTrigger>
            <PopoverContent className="min-h-50 w-80 sm:max-w-100" align="end">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-lg">Notificaciones</h2>
                </div>
                <div className="flex flex-col gap-5">
                    <span className="text-accent-foreground">Aún no hay notificaciones.</span>
                    <div className="flex flex-col gap-1">
                        <PopoverHeader className="font-medium"></PopoverHeader>
                        <PopoverDescription className="text-sm text-muted-foreground">

                        </PopoverDescription>
                    </div>
                </div>

            </PopoverContent>
        </Popover>
    );
}

const breadcrumbLabels = {
    "dashboard": "Panel",
    "eventos": "Eventos",
    "usuarios": "Usuarios",
};

function BreadCrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList className="flex flex-nowrap justify-end overflow-auto max-w-40 md:max-w-full">
                    {segments.map((segment, index) => {
                        const path = "/" + segments.slice(0, index + 1).join("/");
                        const label = breadcrumbLabels[segment] || segment;
                        const isLast = index === segments.length - 1;

                        return (
                            <React.Fragment key={path} >
                                {index > 0 && <BreadcrumbSeparator />}

                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : segment === "dashboard" ? (
                                    <BreadcrumbLink className="cursor-default">{label}</BreadcrumbLink>
                                ) : (
                                    <BreadcrumbLink render={<Link href={path} />}>
                                        {label}
                                    </BreadcrumbLink>
                                )}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </>
    );
}
import { NextResponse } from "next/server";

// Producción (debe coincidir con API_BASE_URL en services/api.js)
const API_BASE_URL = "https://sistema-gestion-api-lqx3.onrender.com";

// Desarrollo local
// const API_BASE_URL = "http://localhost:8000";

async function getUsuarioActual(token) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!res.ok) return null;
        return await res.json();
    } catch {
        return undefined;
    }
}

export async function proxy(request) {
    const token = request.cookies.get("auth_token")?.value;
    const pathname = request.nextUrl.pathname;

    const isLoginPage = pathname === "/login";
    const isDashboardPage = pathname.startsWith("/dashboard");

    // Si no hay token e intenta entrar al dashboard, redirigir
    if (!token && isDashboardPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Si hay token, la API decide si es legítimo (firma, expiración y blacklist)
    if (token && (isDashboardPage || isLoginPage)) {
        const usuario = await getUsuarioActual(token);

        if (usuario === null && isDashboardPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (usuario) {
            if (isLoginPage) {
                return NextResponse.redirect(new URL("/", request.url));
            }

            // Solo admin puede entrar al dashboard
            if (isDashboardPage && usuario.rol !== "admin") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    }

    if (isDashboardPage && pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/dashboard/eventos", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};

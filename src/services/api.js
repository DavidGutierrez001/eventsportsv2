import { toast } from "@/components/ui/toast";

// Producción (Sin el /docs al final)
const API_BASE_URL = "https://sistema-gestion-api-lqx3.onrender.com";

// Desarrollo local
// const API_BASE_URL = "http://localhost:8000";

async function request(path, options = {}) {
    let res;

    try {
        // 1. Guardamos la respuesta en 'res'
        res = await fetch(`${API_BASE_URL}${path}`, {
            credentials: "include",
            ...options,
        });
    } catch (error) {
        toast.add({
            title: "Error",
            description: "No fue posible conectar con la API.",
            variant: "destructive",
        });
        return null;
    }

    const text = await res.text();
    const data = text ? safeParseJson(text) : null;

    if (!res.ok && !data?.success) {
        const errorMessage = data?.message || "Ocurrió un error en la solicitud.";
        toast.add({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
        throw new Error(errorMessage);
    }

    return data;
}

// Función para analizar de manera segura el JSON
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

export { API_BASE_URL, request };
const API_BASE_URL = "https://cafeteria-api-sg4t.onrender.com";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        ...options,
    });

    const text = await res.text();
    const data = text ? safeParseJson(text) : null;

    if (!res.ok) {
        throw new Error(
            data?.detail ||
            data?.message ||
            `Error en la solicitud (${res.status})`
        );
    }

    return data;
}

function safeParseJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

export { API_BASE_URL, request };
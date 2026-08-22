import { request } from "./api";

async function getEvents() {
    return await request("/eventos");
}

async function getEventById(eventId) {
    return await request(`/eventos/${eventId}`);
}

async function createEvent(eventData) {
    const token = localStorage.getItem("token");
    return await request("/eventos", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });
}

async function updateEvent(eventId, eventData) {
    const token = localStorage.getItem("token");
    return await request(`/eventos/${eventId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });
}

async function deleteEvent(eventId) {
    const token = localStorage.getItem("token");
    return await request(`/eventos/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}

async function uploadEventImage(eventId, file) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("archivo", file);
    return await request(`/eventos/${eventId}/imagen`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
}

async function deleteEventImage(eventId) {
    const token = localStorage.getItem("token");
    return await request(`/eventos/${eventId}/imagen`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}

async function subscribeToEvent(eventId) {
    const token = localStorage.getItem("token");
    return await request(`/eventos/${eventId}/inscribirse`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
}

async function getMySubscriptions() {
    const token = localStorage.getItem("token");
    return await request("/eventos/mis-inscripciones", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

async function cancelSubscription(eventId) {
    const token = localStorage.getItem("token");
    return await request(`/eventos/${eventId}/inscribirse`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}

export {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadEventImage,
    deleteEventImage,
    subscribeToEvent,
    getMySubscriptions,
    cancelSubscription,
};

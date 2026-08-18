import { request } from "./api";

async function loginUser(credentials) {
    return await request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
}

async function registerUser(user) {
    return await request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

export { loginUser, registerUser };
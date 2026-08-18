import { request } from "./api";

async function getUsers(limit = 20) {
    const data = await request(`/users?limit=${limit}`);
    return data.users;
}

async function getUser(id) {
    return await request(`/users/${id}`);
}

async function createUser(user) {
    return await request("/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

async function updateUser(id, user) {
    return await request(`/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

async function deleteUser(id) {
    return await request(`/users/${id}`, {
        method: "DELETE",
    });
}

export { getUsers, getUser, createUser, updateUser, deleteUser };
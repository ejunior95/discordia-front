import { api } from "@/server/api";

export async function createUser(data: FormData) {
    return api.request({
        method: 'POST',
        url: 'users',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function updateUser(id: string, data: FormData) {
    return api.request({
        method: 'PATCH',
        url: `users/${id}`,
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
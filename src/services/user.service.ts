import { api } from "@/server/api";

export default class UserService {

  async create(data: FormData) {
        const response = await api.request({
          method: 'POST',
          url: 'users',
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
    }

    async update(id: string, data: FormData) {
        const response = await api.request({
          method: 'PATCH',
          url: `users/${id}`,
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
    }
}
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
}
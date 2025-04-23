import { ICreateUser } from "@/interfaces/user";
import { api } from "@/server/api";

export default class UserService {
    async create(data: ICreateUser) {
        if (data) {
            const response = await api.request({
                method: 'POST',
                url: 'users',
                data
            });
            return response;
        }
    };
}
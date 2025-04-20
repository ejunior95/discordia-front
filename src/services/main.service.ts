import { api } from "@/server/api";

export interface IResponseApiAllIa {
    'chat-gpt': {
        response: string
    },
    gemini: {
        response: string
    },
    deepseek: {
        response: string
    },
    grok: {
        response: string
    }
}

export default class MainService {
    
    async askToAll(question: string) {
        try {
            if (question && question !== '') {
                const response = await api.request({
                    method: 'POST',
                    url: 'ask-to-all',
                    data: { question }
                });
                return response;
            }
        } catch (error) {
            console.error(`Erro na requisição API: ${error}`)
        }
    };
    
    async askToOne(question: string, agent: string) {
        try {
            if (question && question !== '') {
                const response = await api.request({
                    method: 'POST',
                    url: 'ask-to-one',
                    data: { question, agent }
                });
                return response;
            }
        } catch (error) {
            console.error(`Erro na requisição API: ${error}`)
        }
    };

}
import { api } from "@/server/api";

export default class TestAgentIaService {
    constructor(
        public prefixUrl: 'chat-gpt' | 'gemini' | 'deepseek' | 'grok'
    ) {};

    async testMessage(question: string) {
        try {
            if (question && question !== '') {
                const response = await api.request({
                    method: 'POST',
                    url: `${this.prefixUrl}/test-message`,
                    data: { question }
                });
                return response;
            }
        } catch (error) {
            console.error(`Erro na requisição API: ${error}`)
        }
    };
}
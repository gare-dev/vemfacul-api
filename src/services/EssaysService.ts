import { JWTClass } from "../../utils/jwt";
import { Redis } from "../../utils/redis";
import { CustomError } from "../errors/HttpError";
import { EssaysRepository } from "../repositories/EssaysRepository";
import client from "../config/huggingface"

function formatRedacaoFeedback(apiResponse: string): string {
    // Remove asteriscos de negrito e listas
    let text = apiResponse.replace(/\*\*(.*?)\*\*/g, '$1'); // remove negrito
    text = text.replace(/^\s*\*\s*/gm, '- '); // transforma bullets "*" em "-"

    // Remove múltiplos espaços e quebras de linha extras
    text = text.replace(/\n{2,}/g, '\n\n');
    text = text.trim();

    return text;
}

export class EssaysService {
    constructor(
        private repository: EssaysRepository,
        private jwtHandler: JWTClass,
        private redis: Redis
    ) { }

    async insertEssay(id_user: string, essay: string, title: string, theme: string) {
        if (!essay) throw new CustomError("Redação não encontrada", 400, "NOTFOUND_ESSAY")


        const response = await client.chatCompletion({
            provider: "auto",
            model: "Qwen/Qwen2.5-7B-Instruct-1M",
            messages: [
                {
                    role: "user",
                    content: `  Você é um avaliador de redações do ENEM. 
                                Avalie a redação abaixo com base nas 5 competências do ENEM (domínio da norma culta, compreensão do tema, argumentação, coesão e proposta de intervenção). 
                                Essa redação deve estar de acordo com o tema: ${theme}. 
                                Identifique erros gramaticais e de estrutura, sugira melhorias de forma breve e dê uma nota final de 0 a 1000. 
                                IMPORTANTE: Sempre termine sua resposta com a nota final no formato exatamente assim:
                                NOTA = [valor numérico de 0 a 1000]
                                Redação: ${essay}
`,
                }
            ]
        })
        console.log(response)

        const text = response.choices[0].message.content
        const match = text?.match(/NOTA\s*=\s*(\d+)/);
        const nota = match ? parseInt(match[1], 10) : null;

        console.log(formatRedacaoFeedback(text ?? ""))
        const formated_answer = formatRedacaoFeedback(text ?? "")

        console.log(nota)

        await this.repository.insertEssay(id_user, essay, title, theme, nota, formated_answer)
        return { notes: formated_answer, score: nota }
    }

    async getUserEssays(id_user: string) {

        return await this.repository.getUserEssays(id_user)
    }
}
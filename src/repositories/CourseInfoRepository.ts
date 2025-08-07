import pool from "../db/connect";
import { CreateCourseInfoType } from "../db/types/CourseType";

export class CourseInfoRepository {
    insertCourseInfo(data: CreateCourseInfoType) {
        const values = [data.modalidades, data.disciplinas_foco, data.media_alunos, data.diferenciais, data.faixa_preco, data.tem_bolsa, data.aceita_programas_publico, data.descricao, data.logo, data.imagens_espaco];

        const query = "INSERT INTO cursinhos_info_table (modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logo, imagens_espaco) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_cinfo";
        return pool.query(query, values);
    }
}
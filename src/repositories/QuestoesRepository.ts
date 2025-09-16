import pool from "../db/connect";

export class QuestoesRepository {
    async insertQuestoes(index: number, id_disciplines: number, year: number) {
        const values = [index, id_disciplines, year]
        const sql = "INSERT INTO questoes_table (index, id_disciplines, year) values ($1, $2, $3) RETURNING id"
        return pool.query(sql, values);
    }
    async selectQuestoes(index: number, year:number) {
        const values = [index, year]
        const sql = "SELECT id FROM questoes_table where index = $1 AND year = $2"
        return pool.query(sql, values);
    }
    async insertQuestoesToUser(id_questao: number, id_user: string, isCorret: boolean) {
        const values = [id_questao, id_user, isCorret]
        const sql = "INSERT INTO user_to_questao_table (id_questao, id_user, iscorret) values ($1, $2, $3)"
        return pool.query(sql, values);
    }

}
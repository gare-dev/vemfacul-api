import pool from "../db/connect";

export class QuestoesRepository {
    async insertQuestoes(index: number, id_disciplines: number, year: number) {
        const values = [index, id_disciplines, year]
        const sql = "INSERT INTO questoes_table (index, id_disciplines, year) values ($1, $2, $3) RETURNING id"
        return await pool.query(sql, values);
    }
    async selectQuestoes(index: number, year: number) {
        const values = [index, year]
        const sql = "SELECT id FROM questoes_table where index = $1 AND year = $2"
        return await pool.query(sql, values);
    }
    async selectQuestoesTouser(id_questao: number, id_user: string) {
        const values = [id_questao, id_user]
        const sql = "SELECT 1 FROM user_to_questao_table where id_questao = $1 AND id_user = $2"
        return await pool.query(sql, values)
    }
    async insertQuestoesToUser(id_questao: number, id_user: string, isCorret: boolean) {
        const values = [id_questao, id_user, isCorret]
        const sql = "INSERT INTO user_to_questao_table (id_questao, id_user, iscorret) values ($1, $2, $3)"
        return await pool.query(sql, values);
    }
    async selectRankin() {
        return await pool.query(`SELECT
  u.username,
  COALESCE(SUM((q.iscorret = TRUE)::int), 0) AS acertosUser
FROM users_table u
LEFT JOIN user_to_questao_table q ON q.id_user = u.id_user
GROUP BY u.id_user, u.nome, u.username
ORDER BY acertosUser DESC`,[])
    }
}
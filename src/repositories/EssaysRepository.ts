import pool from "../db/connect"


export class EssaysRepository {
    async insertEssay(id_user: string, essay: string, title: string, theme: string, score: number | null, feedback: string) {
        const values = [id_user, essay, title, theme, score, feedback]

        const query = "INSERT INTO essays_table (id_user, essay, title, theme, score, notes) VALUES ($1, $2, $3, $4, $5, $6)"
        return await pool.query(query, values)
    }

    async getUserEssays(id_user: string) {
        const values = [id_user]

        const query = "SELECT * FROM essays_table WHERE id_user = $1"
        return await pool.query(query, values)
    }
}
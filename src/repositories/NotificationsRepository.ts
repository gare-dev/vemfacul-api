import pool from "../db/connect";

export class NotificationsRepository {
    async insertNotification(id_user: number, id_actor: number, id_post: number, type: string) {
        const values = [id_user, id_actor, id_post, type]
        const sql = "INSERT INTO notifications_table (id_user, id_actor, id_postagem, type) VALUES ($1, $2, $3, $4);"
        return await pool.query(sql, values);
    }
}
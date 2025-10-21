import pool from "../db/connect"

export class ReportedPostsRepository {
    async reportPost(id_post: string, reported_by: string, content: string) {
        const values = [id_post, reported_by, content];

        const query = 'INSERT INTO reported_posts_table (id_post, reported_by, post_content) VALUES ($1, $2, $3) RETURNING id_reported_post';
        return await pool.query(query, values);
    }

    async findPostById(id_post: string) {
        const values = [id_post];
        const query = 'SELECT * FROM postagens_table WHERE id_postagem = $1';

        return await pool.query(query, values);
    }
}
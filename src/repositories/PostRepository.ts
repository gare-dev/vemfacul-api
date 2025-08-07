import pool from "../db/connect"


export class PostsRepository {
    async createPost(user_id: string, content: string) {
        const values = [user_id, content]

        const query = 'INSERT INTO postagens_table (id_user, content) VALUES ($1, $2)'
        return await pool.query(query, values)
    }

    async getPostagemByUsername(username: string) {
        const values = [username]

        const query = ` SELECT
                        p.id_postagem,
                        p.content,
                        p.created_at,
                        u.username,
                        u.id_user,
                    ( 
                        SELECT COUNT(*) 
                        FROM postagenslike_table l 
                        WHERE l.id_postagem = p.id_postagem
                    ) 
                        AS total_likes
                    FROM
                        postagens_table p
                    JOIN
                        users_table u ON p.id_user = u.id_user
                    WHERE
                        u.username LIKE $1
                    ORDER BY
                        p.id_postagem DESC;`
        return await pool.query(query, values)
    }

    async likePost(id_post: string, id_user: string) {
        const values = [id_post, id_user]

        const query = "INSERT INTO postagensLike_table (id_postagem, id_user)  VALUES ($1, $2) ON CONFLICT DO NOTHING"
        return pool.query(query, values)
    }

    async unlikePost(id_post: string, id_user: string) {
        const values = [id_post, id_user]

        const query = "DELETE FROM postagensLike_table WHERE id_postagem = $1 AND id_user = $2"
        return await pool.query(query, values)
    }

    async getLikesCount(id_post: string) {
        const values = [id_post]

        const query = `
            SELECT
                (
                    SELECT count(*)
                    FROM postagenslike_table l
                    WHERE p.id_postagem = l.id_postagem
                ) AS like_count
            FROM postagenslike_table l
            JOIN postagens_table p on p.id_postagem = l.id_postagem
            JOIN users_table u on p.id_user = u.id_user AND l.id_user = u.id_user
            WHERE p.id_postagem = $1
            `

        return await pool.query(query, values)
    }

    async selectAllPosts() {
        const query = `
            SELECT
                p.id_postagem,
                p.content,
                p.created_at,
                u.username,
                u.id_user,
                u.nome,
                u.foto,
                (
                    SELECT COUNT(*) 
                    FROM postagenslike_table l 
                    WHERE l.id_postagem = p.id_postagem
                ) AS total_likes
            FROM
                postagens_table p
            JOIN
                users_table u ON p.id_user = u.id_user
            ORDER BY
                p.created_at DESC;`
        return await pool.query(query)
    }
}
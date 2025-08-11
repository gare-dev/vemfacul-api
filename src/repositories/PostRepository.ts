import pool from "../db/connect"


export class PostsRepository {
    async createPost(user_id: string, content: string) {
        const values = [user_id, content]

        const query = 'INSERT INTO postagens_table (id_user, content) VALUES ($1, $2)'
        return await pool.query(query, values)
    }

    async getPostagemByUsername(id_user: string, username: string) {
        const values = [id_user, username]

        const query = ` SELECT
    p.id_postagem,
    p.content,
    p.created_at,
    u.username,
    u.id_user,
    (
        select count(*)
        from postagens_table
        where coments = true AND postagem_pai = p.id_postagem
    ) AS total_comments,
    (
        SELECT COUNT(*) 
        FROM postagenslike_table l 
        WHERE l.id_postagem = p.id_postagem
    ) AS total_likes,
    (
    SELECT 1 from postagenslike_table WHERE id_postagem = p.id_postagem AND id_user = $1
    ) as alredyLiked
FROM
    postagens_table p
JOIN
    users_table u ON p.id_user = u.id_user
WHERE
    u.username LIKE $2 AND coments = false
ORDER BY
    p.id_postagem DESC`
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
                    select count(*)
                    from postagens_table
                    where coments = true AND postagem_pai = p.id_postagem
                ) AS total_comments,
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

    async createComment(content: string, postagem_pai: number, id_user: number) {
        const values = [content, postagem_pai, id_user]

        const query = "INSERT INTO postagens_table (coments, content, postagem_pai, id_user) VALUES (true, $1, $2, $3)"
        return await pool.query(query, values)

    }

    async selectComments(id_pai: string) {
        const values = [id_pai]

        const query = `SELECT
    p.id_postagem,
    p.content,
    p.created_at,
    u.username,
    u.id_user,
    u.foto,
    (
        select count(*)
        from postagens_table
        where coments = true AND postagem_pai = p.id_postagem
    ) AS total_comments,
    (
        SELECT COUNT(*) 
        FROM postagenslike_table l 
        WHERE l.id_postagem = p.id_postagem
    ) AS total_likes
FROM
    postagens_table p
JOIN
    users_table u ON p.id_user = u.id_user
WHERE
    coments = true AND postagem_pai = $1`
        return await pool.query(query, values)
    }

    async selectSinglePost(id_user: string, id_postagem: string) {
        const values = [id_user, id_postagem]

        const query = `
SELECT
    p.id_postagem,
    p.content,
    p.created_at,
    u.username,
    u.id_user,
    u.foto,
    (
        select count(*)
        from postagens_table
        where coments = true AND postagem_pai = p.id_postagem
    ) AS total_comments,
    (
        SELECT COUNT(*) 
        FROM postagenslike_table l 
        WHERE l.id_postagem = p.id_postagem
    ) AS total_likes,
     (
     SELECT 1 from postagenslike_table WHERE id_postagem = p.id_postagem AND id_user = $1
    ) as alredyLiked
FROM
    postagens_table p
JOIN
    users_table u ON p.id_user = u.id_user
WHERE
    p.id_postagem = $2
;  
`
        return await pool.query(query, values)
    }

}
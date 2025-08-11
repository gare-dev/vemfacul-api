const pool = require('../config/db');

const postagensTableModel = {
    createPostagem: async (user_id, content) => {
        const values = [user_id, content]

        try {
            const query = 'INSERT INTO postagens_table (id_user, content) VALUES ($1, $2)'
            return await pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },
    // deletPostagem
    // [more ...]
    selectPostagem: async (id_user, username) => {
        const values = [id_user, username]

        try {
            const query = `
SELECT
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
    p.id_postagem DESC;
`
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },
    selectSinglePostagem: async (id_user, id_postagem) => {
        const values = [id_user, id_postagem]

        try {
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
        } catch (err) {
            throw err
        }
    },
    likePostagem: async (id_postagem, id_user) => {
        const values = [id_postagem, id_user]

        try {
            const query = "INSERT INTO postagensLike_table (id_postagem, id_user)  VALUES ($1, $2) ON CONFLICT DO NOTHING"
            console.log("POSTAGEM CURTIDA COM SUCESSO")
            return pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },
    unlikePostagem: async (id_postagem, id_user) => {
        const values = [id_postagem, id_user]

        try {
            const query = "DELETE FROM postagensLike_table WHERE id_postagem = $1 AND id_user = $2"
            console.log("POSTAGEM DESCURTIDA COM SUCESSO")
            return await pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },

    selectAllPosts: async () => {
        try {
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
        } catch (err) {
            throw err;
        }
    },

    createComents: async (content, postagem_pai, id_usuario) => {
        const values = [content, postagem_pai, id_usuario]
        try {
            const query = "INSERT INTO postagens_table (coments, content, postagem_pai, id_user) VALUES (true, $1, $2, $3)"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    selectComents: async (id_pai) => {
        const values = [id_pai]
        try {
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
    ) AS total_likes
FROM
    postagens_table p
JOIN
    users_table u ON p.id_user = u.id_user
WHERE
    coments = true AND postagem_pai = $1
            `
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    }
}

module.exports = postagensTableModel
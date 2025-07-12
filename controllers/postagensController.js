const postagensTableModel = require("../models/postagensTableModel");
const getDecodedJwt = require("../utils/getDecodedJwt")

const postagensController = {
    createPostagem: async (req, res) => {
        const { content } = req.body;

        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const user_id = token.id

        try {
            const response = await postagensTableModel.createPostagem(user_id, content)
            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Post criado com sucesso",
                    code: "POSTAGEM_SUCESS",
                    data: `post criado por: ${user_id}`
                })
            } else {
                return res.status(400).json({
                    message: "Erro ao criar o post",
                    code: "POSTAGEM_ERROR"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    },

    // deletPostagem
    // [more ...]
    getPostagem: async (req, res) => {
        const username = req.params.username

        try {
            const responsePosts = await postagensTableModel.selectPostagem(username)
            // const responseLikes = await postagensTableModel.getLikesCout(id_postagem)

            if (responsePosts.rowCount >= 1) {
                    
                return res.status(200).json({
                    message: "Postagens encontradas",
                    code: "POSTAGENS_FOUND",
                    postagens: responsePosts.rows,
                })
            } else {
                return res.status(400).json({
                    message: "Usuario não encontrado",
                    code: "POSTAGEM_NOT_FOUND"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    },

    likePostagem: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])

        const { id_postagem } = req.body
        const id_user = token.id

        try {
            const alreadyLiked = await postagensTableModel.alredyLike(id_postagem, id_user)

            if (alreadyLiked.rowCount > 0) {
                return res.status(200).json({
                    message: "Usuário já curtiu essa postagem",
                    code: "ALREADY_LIKED",
                    alreadyLiked: true
                });
            }

            const response = await postagensTableModel.likePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "postagem curtida com sucesso!",
                    code: "LIKE_SUCESS", 
                    alreadyLiked: false
                })
            } else {
                return res.status(400).json({
                    message: "Usuário já curtiu essa postagem",
                    code: "ALREADY_LIKED"
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    },
    unlikePostagem: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])

        const { id_postagem } = req.body
        const id_user = token.id // getDecodeJwt

        try {
            const response = await postagensTableModel.unlikePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Like removido!",
                    code: "UNLIKE_SUCESS"
                })
            } else {
                return res.status(400).json({
                    message: "Erro ao remover like.",
                    code: "LIKE_SUCESS"

                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde",
                error: error.toString()
            })
        }
    },
    getLikesCount: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const id_user = token.id

        const { id_postagem } = req.body;

        try {
            const response = await postagensTableModel.getLikesCout(id_postagem)

            if (response.rowCount >= 1) {
            const alreadyLiked = await postagensTableModel.alredyLike(id_postagem, id_user)
                return res.status(200).json({
                    message: "Postagem encontrada",
                    code: "COUNT_LIKE_SUCESS",
                    likes: response.rows[0].like_count,
                    alreadyLiked: alreadyLiked.rowCount > 0 ? true : false
                })
            } else {
                return res.status(200).json({
                    message: "não há likes para esse post",
                    code: "LIKES_NULL"
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde",
                error: error.toString()
            })
        }
    },

    selectAllPosts: async (req, res) => {
        try {
            const response = await postagensTableModel.selectAllPosts()

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Postagens encontradas",
                    code: "POSTAGENS_FOUND",
                    postagens: response.rows
                })
            } else {
                return res.status(400).json({
                    message: "Nenhuma postagem encontrada",
                    code: "POSTAGEM_NOT_FOUND"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    }

}

module.exports = postagensController;
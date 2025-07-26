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
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const id_user = token.id
        const username = req.params.username

        try {
            const responsePosts = await postagensTableModel.selectPostagem(id_user, username)
            if (responsePosts.rowCount >= 1) {
                return res.status(200).json({
                    message: "Postagens encontradas",
                    code: "POSTAGENS_FOUND",
                    postagens: responsePosts.rows
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
    getSinglePostagem: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const id_user = token.id
        const id_postagem = +req.params.id_postagem

        console.log(id_postagem)
        try {
            const responsePosts = await postagensTableModel.selectSinglePostagem(id_user, id_postagem)
            console.log(responsePosts.rows)
            if (responsePosts.rowCount >= 1) {

                return res.status(200).json({
                    message: "Postagem encontradas",
                    code: "POSTAGENS_FOUND",
                    postagem: responsePosts.rows,
                })
            } else {
                return res.status(400).json({
                    message: "Postagem não encontrado",
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
    },

    createComent: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const id_user = token.id
        const { content, postagem_pai } = req.body

        try {
            const response = await postagensTableModel.createComents(content, postagem_pai, id_user)
            if (response.rowCount >= 1) return res.status(200).json({
                message: "Comentario criado com sucesso!",
                code: "COMENT_SUCESS"
            })
            return res.status(400).json({
                message: "erro ao criar comentario",
                code: "COMENT_ERROR",
                error: response.rows[0]
            })


        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    },
    selectComent: async (req, res) => {
        const { id_pai } = req.body

        try {
            const response = await postagensTableModel.selectComents(id_pai)
            console.log("comentarios encontrados")
            if (response.rowCount >= 1) return res.status(200).json({
                message: "Comentarios encontrados!",
                code: "COMENTS_FOUND",
                coments: response.rows
            })
            return res.status(404).json({
                message: "Essa publicacao nao tem comentarios",
                code: "COMENTS_NOT_FOUND"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    }

}

module.exports = postagensController;
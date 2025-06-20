const jwt = require('jsonwebtoken');
const supabase = require("../config/supabaseClient")
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
                    message: "erro ao criar o post"
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
            const response = await postagensTableModel.selectPostagem(username)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Postagens encontradas",
                    code: "POSTAGENS_FOUND",
                    postagens: response.rows,
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


        const id_postagem = req.params.id
        const id_user = token.id

        try {
            const response = await postagensTableModel.likePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "postagem curtida com sucesso!"
                })
            } else {
                return res.status(400).json({
                    message: "Usuário já curtiu essa postagem"
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


        const id_postagem = req.params.id;
        const id_user = token.id

        try {
            const response = await postagensTableModel.unlikePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Like removido!"
                })
            } else {
                return res.status(400).json({
                    message: "Erro ao remover like."
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde",
                error: error.toString()
            })
        }
    }

}

module.exports = postagensController;
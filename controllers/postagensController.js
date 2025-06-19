const jwt = require('jsonwebtoken');
const supabase = require("../config/supabaseClient")
const postagensTableModel = require("../models/postagensTableModel");

const postagensController = {
    createPostagem: async (req, res) => {
        const { content } = req.body;

        const token = req.cookies.auth
        const secret = process.env.secret
        const decoded = jwt.verify(token, secret)

        const user_id = decoded.id
        const user_email = decoded.email

        try {
            const response = await postagensTableModel.createPostagem(user_id, content)
            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Post criado com sucesso",
                    data: `post criado por: ${user_email}`,
                    code: "POSTAGEM_SUCESS"
                })
            } else {
                return res.status(400).json({
                    message: "erro ao criar o post",
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
        const { username } = req.params
        

        try {
            const response = await postagensTableModel.selectPostagem(username)

            if(response.rowCount >= 1){
                res.status(200).json({
                    message: "Postagens encontradas com sucesso!",
                    code: "POSTAGENS_FOUND",
                    postagens: response.rows
                })
            } else {
                res.status(400).json({
                    message: "Usuario nao encontrado!",
                    code: "USER_NOTFOUND"
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            })
        }
    },

    likePostagem: async (req, res) => {
        const token = req.cookies.auth
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)

        const id_postagem = req.params.id
        const id_user = decoded.id

        try {
            const response = await postagensTableModel.likePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "postagem curtida com sucesso!",
                    code: "POST_LIKED"
                })
            } else {
                return res.status(400).json({
                    message: "Usuário já curtiu essa postagem",
                    code: "POST_ALREDYLIKED"

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
        const token = req.cookies.auth
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)

        const id_postagem = req.params.id;
        const id_user = decoded.id

        try {
            const response = await postagensTableModel.unlikePostagem(id_postagem, id_user)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Like removido!",
                    code: "UNLIKED_SUCESS"

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
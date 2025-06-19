const jwt = require("jsonwebtoken")
const getDecodedJwt = require("../utils/getDecodedJwt");

const personalEventsTableModel = require("../models/personalEventsTableModel");

const personalEventsTableController = {
    insertPersonalEvent: async (req, res) => {
        const {
            day,
            month,
            year,
            title,
            cursinho,
            descricao,
            foto,
            link,
            type,
            color,
            main_title,
        } = req.body;
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const idUser = token.id

        try {
            const response = await personalEventsTableModel.insertPersonalEvent(idUser, day, month, year, title, cursinho, descricao, foto, link, type, color, main_title)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "EVENT_ADDED",
                    message: "Evento adicionado na sua agenda pessoal."
                })
            }

            if (response.rowCount >= 0) {
                return res.status(404).json({
                    code: "EVENT_ERROR",
                    message: "Evento não adicionado a sua agenda pessoal."
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });

        }
    },

    getPersonalEvents: async (req, res) => {
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const idUser = token.id

        try {
            const response = await personalEventsTableModel.getPersonalEvents(idUser)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "EVENTS_FOUND",
                    data: response.rows
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },


    insertPersonalLocalEvent: async (req, res) => {
        const {
            day,
            month,
            year,
            title,
            descricao,
            color,
            main_title,
            hora,
            isImportant
        } = req.body;
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const idUser = token.id

        try {
            const response = await personalEventsTableModel.insertPersonalLocalEvent(idUser, day, month, year, title, descricao, color, main_title, hora, isImportant)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "EVENT_ADDED",
                    message: "Evento adicionado na sua agenda pessoal."
                })
            }

            if (response.rowCount >= 0) {
                return res.status(404).json({
                    code: "EVENT_ERROR",
                    message: "Evento não adicionado a sua agenda pessoal."
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });

        }
    },

    deletePersonalEvent: async (req, res) => {
        const { id_pevent } = req.body;
        const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
        const idUser = token.id

        try {
            const response = await personalEventsTableModel.deletePersonalEvent(idUser, id_pevent)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "EVENT_DELETED",
                    message: "Evento deletado com sucesso."
                })
            }

            if (response.rowCount >= 0) {
                return res.status(404).json({
                    code: "EVENT_ERROR",
                    message: "Evento não deletado."
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });

        }
    },


};

module.exports = personalEventsTableController
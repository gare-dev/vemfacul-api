const jwt = require("jsonwebtoken")

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
        const token = req.cookie
        const secret = process.env.SECRET;
        const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBpcG9jYWdhbWVyNjFAZ21haWwuY29tIiwiaW1hZ2UiOiJodHRwczovL2JzeHRqeHZpbWlkcHh5amlkbnJsLnN1cGFiYXNlLmNvL3N0b3JhZ2UvdjEvb2JqZWN0L3B1YmxpYy91c2Vycy1waG90b3MvaW1hZ2VzLzE3NDYzOTUwMjk0ODRfZXVldGVjLmpwZ19leUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW5CcGNHOWpZV2RoYldWeU5qRkFaMjFoYVd3dVkyOXRJaXdpYVdGMElqb3hOelExT1RJMU9ETTFMQ0psZUhBaU9qRTNORFU1TWprME16VjkuREZYMWVxTFI1OU1GQTVXcm9ESFhLcmJBeEtDRC1feHdnV1lKbzdaOU1JUSIsIm5hbWUiOiJHQUVMIiwiaWQiOiI0MiIsImlhdCI6MTc0NzEwMDkyMSwiZXhwIjoxNzQ3MTM2OTIxfQ.lD0LLpQYzcaNq09JebQs47sJDqL1jG_6oBAiBcXe9mg", secret);
        const idUser = decoded.id

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
        const token = req.cookie
        const secret = process.env.SECRET;
        const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBpcG9jYWdhbWVyNjFAZ21haWwuY29tIiwiaW1hZ2UiOiJodHRwczovL2JzeHRqeHZpbWlkcHh5amlkbnJsLnN1cGFiYXNlLmNvL3N0b3JhZ2UvdjEvb2JqZWN0L3B1YmxpYy91c2Vycy1waG90b3MvaW1hZ2VzLzE3NDYzOTUwMjk0ODRfZXVldGVjLmpwZ19leUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW5CcGNHOWpZV2RoYldWeU5qRkFaMjFoYVd3dVkyOXRJaXdpYVdGMElqb3hOelExT1RJMU9ETTFMQ0psZUhBaU9qRTNORFU1TWprME16VjkuREZYMWVxTFI1OU1GQTVXcm9ESFhLcmJBeEtDRC1feHdnV1lKbzdaOU1JUSIsIm5hbWUiOiJHQUVMIiwiaWQiOiI0MiIsImlhdCI6MTc0NzEwMDkyMSwiZXhwIjoxNzQ3MTM2OTIxfQ.lD0LLpQYzcaNq09JebQs47sJDqL1jG_6oBAiBcXe9mg", secret);
        const idUser = decoded.id

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
    }
};

module.exports = personalEventsTableController
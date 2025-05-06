const eventsTableModel = require("../models/eventsTableModel")


const eventsTableController = {
    createEvent: async (req, res) => {
        const { day, month, year, title, cursinho, descricao } = req.body

        try {
            const response = await eventsTableModel.createEvent(day, month, year, title, cursinho, descricao,)

            if (response.rowCount >= 1) {
                return res.status(200).jso({
                    message: "Evento criado com sucesso.",
                    code: "EVENT_CREATED"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    }
}
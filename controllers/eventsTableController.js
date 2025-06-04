const supabase = require("../config/supabaseClient")
const eventsTableModel = require("../models/eventsTableModel")


const eventsTableController = {
    createEvent: async (req, res) => {
        const eventData = JSON.parse(req.body.userData)
        const { day, month, year, title, cursinho, descricao, link, color, type, main_title } = eventData
        const image = req.file

        async function uploadImage(id_event) {
            try {
                const uploadPhoto = async (image) => {
                    const filePath = `images/${Date.now()}_${image.originalname}`

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from("cursinho-imagens")
                        .upload(filePath, image.buffer, {
                            contentType: image.mimeType,
                            upsert: true
                        });

                    if (uploadError) {
                        throw new Error("Erro ao enviar para o supabase: " + uploadError.message)
                    }
                    const { data: publicUrlData } = supabase.storage
                        .from("cursinho-imagens")
                        .getPublicUrl(filePath)

                    return publicUrlData
                }

                let fotoUrl = null

                if (image) {
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                    if (!allowedTypes.includes(image.mimetype)) {
                        return res.status(400).json({ error: 'Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.' });
                    }

                    fotoUrl = await uploadPhoto(image);

                    try {
                        await eventsTableModel.updatePhoto(fotoUrl, id_event)
                    } catch (error) {
                        throw new Error("Erro ao atualizar foto." + error)
                    }
                }
            } catch (error) {
                throw error
            }

        }

        try {
            const response = await eventsTableModel.createEvent(day, month, year, title, cursinho, descricao, link, color, type, main_title)

            uploadImage(response.rows[0].id_event)
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
    },


    getEvents: async (req, res) => {

        try {
            const response = await eventsTableModel.getEvents()

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    code: "EVENTS_SUCCESSFULLY",
                    data: response.rows
                })
            }
            return res.status(404).json({
                message: "Não foram encontrados eventos",
                code: "NO_FOUND_EVENTS"
            })

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    }
}

module.exports = eventsTableController
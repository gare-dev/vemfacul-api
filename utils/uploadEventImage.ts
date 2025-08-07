import { MulterFile } from "./uploadPhoto"
import supabase from "../src/config/supabase";
import { CustomError } from "../src/errors/HttpError";

export const uploadEventImage = async (image: MulterFile) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(image.mimetype)) {
        throw new CustomError('Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.', 400, "INVALID_FORMAT")
    }
    const filePath = `images/${Date.now()}_${image.originalname}`

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cursinho-imagens")
        .upload(filePath, image.buffer!, {
            contentType: image.mimetype,
            upsert: true
        });

    if (uploadError) {
        throw new Error("Erro ao enviar para o supabase: " + uploadError.message)
    }
    const { data: publicUrlData } = supabase.storage
        .from("cursinho-imagens")
        .getPublicUrl(filePath)

    return publicUrlData.publicUrl
}


import supabase from "../src/config/supabase"
import { MulterFile } from "../utils/uploadPhoto"

const uploadToSupabase = async (file: MulterFile, type: string, email: string) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Formato de imagem inválido (${type}). Apenas JPEG, PNG e GIF são permitidos.`);
    }

    const filePath = `${type}s/${Date.now()}_${file.originalname}_${email}`;
    const { error: uploadError } = await supabase.storage
        .from("users-photos")
        .upload(filePath, file.buffer!, {
            contentType: file.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro ao enviar ${type} para o Supabase: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from("users-photos")
        .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
};

export default uploadToSupabase
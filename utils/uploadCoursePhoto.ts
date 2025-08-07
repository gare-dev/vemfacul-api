import supabase from "../src/config/supabase"
import { MulterFile } from "../utils/uploadPhoto"

const uploadCoursePhoto = async (file: MulterFile, nomeExibido: string) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos. Arquivo: ${file}`);
    }


    const filePath = `${nomeExibido}/${nomeExibido}_${file.originalname}`;

    const { error: uploadError } = await supabase.storage
        .from("cursinho-imagens")
        .upload(filePath, file.buffer!, {
            contentType: file.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro ao enviar para o Supabase: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from("cursinho-imagens")
        .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
};

export default uploadCoursePhoto
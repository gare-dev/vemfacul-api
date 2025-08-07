import supabase from "../src/config/supabase"


export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer?: Buffer;
}

const uploadPhoto = async (photo: MulterFile, email: string) => {
    const filePath = `images/${Date.now()}_${photo.originalname}_${email}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("users-photos")
        .upload(filePath, photo.buffer!, {
            contentType: photo.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new Error('Erro ao enviar para o Supabase: ' + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
        .from("users-photos")
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};

export default uploadPhoto
import { CreatePersonalEventType } from "../db/types/PersonalEventType";
import { CustomError } from "../errors/HttpError";


export function CreatePersonalEventValidation(data: CreatePersonalEventType) {
    const requiredFields = [
        "id_user",
        "day",
        "month",
        "year",
        "title",

        "descricao",



        "color",
        "main_title",
    ];

    const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

    if (missingFields.length > 0) {
        throw new CustomError(`Campos obrigatórios faltando: ${missingFields.join(", ")}`, 400, "MISSING_FIELDS");
    }

}
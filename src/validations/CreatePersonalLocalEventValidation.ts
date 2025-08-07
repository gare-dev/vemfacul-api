import { CreatePersonalEventType, CreatePersonalLocalEventType } from "../db/types/PersonalEventType";
import { CustomError } from "../errors/HttpError";


export function CreatePersonalLocalEventValidation(data: CreatePersonalLocalEventType) {
    const requiredFields = [
        "id_user",
        "day",
        "month",
        "year",
        "title",
        "cursinho",
        "descricao",
        "foto",
        "link",
        "type",
        "color",
        "main_title",
        "isImportant",
        "hora"
    ];

    const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

    if (missingFields.length > 0) {
        throw new CustomError(`Campos obrigatórios faltando: ${missingFields.join(", ")}`, 400, "MISSING_FIELDS");
    }

}
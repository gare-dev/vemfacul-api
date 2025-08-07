import { CreateEventType } from "../db/types/EventsType";
import { CustomError } from "../errors/HttpError";


export function CreateEventValidation(data: CreateEventType) {
    const requiredFields = [
        "day",
        "month",
        "year",
        "title",
        "cursinho",
        "descricao",
        "link",
        "color",
        "type",
        "main_title",
    ];

    const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

    if (missingFields.length > 0) {
        throw new CustomError(`Campos obrigatórios faltando: ${missingFields.join(", ")}`, 400, "MISSING_FIELDS");
    }

}
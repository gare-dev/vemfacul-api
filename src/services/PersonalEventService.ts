import { CreatePersonalEventType, CreatePersonalLocalEventType } from "../db/types/PersonalEventType";
import { CustomError } from "../errors/HttpError";
import { PersonalEventRepository } from "../repositories/PersonalEventRepository";
import { CreatePersonalEventValidation } from "../validations/CreatePersonalEventValidation";
import { CreatePersonalLocalEventValidation } from "../validations/CreatePersonalLocalEventValidation";


export class PersonalEventService {
    constructor(private repository: PersonalEventRepository) { }

    async insertPersonalEvent(data: CreatePersonalEventType) {
        CreatePersonalEventValidation(data)

        return await this.repository.insertPersonalEvent(data)
    }

    async getPersonalEventsById(id_user: string) {
        if (!id_user) throw new CustomError("ID User é necessário pra obter os eventos pessoal do usuário.", 400, "IDUSER_MISSING")

        const personal_events = await this.repository.getPersonalEventsById(id_user)

        if (personal_events.rowCount === 0) throw new CustomError("Não há eventos pessoais registrados.", 400, "EMPTY_PERSONALEVENTS")

        return personal_events.rows
    }

    async insertPersonalLocalEvent(data: CreatePersonalLocalEventType) {
        CreatePersonalLocalEventValidation(data)

        return await this.repository.insertPersonalLocalEvent(data)
    }

    async deletePersonalEvent(id_event: string, id_user: string) {
        if (!id_event) throw new CustomError("ID Event é necessário para excluir um evento.", 400, "IDEVENT_MISSING")
        if (!id_user) throw new CustomError("ID User é necessário para excluir um evento", 400, "IDUSER_MISSING")

        const deleted_event = await this.repository.deletePersonalEvent(id_event, id_user)

        if (deleted_event.rowCount === 0) throw new CustomError("Nenhum evento com esse ID foi encontrado.", 400, "INVALID_IDPEVENT")

        return deleted_event
    }
}
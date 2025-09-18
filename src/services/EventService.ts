import { MulterFile } from "../../utils/uploadPhoto";
import { CreateEventType } from "../db/types/EventsType";
import { EventsRepository } from "../repositories/EventRepository";
import { CreateEventValidation } from "../validations/CreateEventValidation";
import { uploadEventImage } from "../../utils/uploadEventImage"
import { CustomError } from "../errors/HttpError";

export class EventService {
    constructor(private repository: EventsRepository) { }

    async createEvent(data: CreateEventType, image: MulterFile, id: string) {
        CreateEventValidation(data)

        if (image) {
            return await Promise.all([
                this.repository.updatePhoto(await uploadEventImage(image), id),
                this.repository.createEvent(data)
            ])
        }
        return await this.repository.createEvent(data)
    }

    async getEvents() {
        return (await this.repository.getEvents()).rows
    }

    async createCourseAdminEvent(id_cursinho: string, day: string, month: string, year: string, title: string, descricao: string, link: string, type: string, main_title: string, hora: string) {
        // TODO tem que adicionar validação de dados 

        return await this.repository.insertCourseAdminEvent(id_cursinho, day, month, year, title, descricao, link, type, main_title, hora)
    }

    async getCourseEventById(id_cursinho: string) {
        if (!id_cursinho) throw new CustomError("ID Cursinho é necessário para buscar os eventos.", 400, "IDCURSINHO_MISSING")

        const events = await this.repository.getCourseEventById(id_cursinho)

        return events.rows

    }
}
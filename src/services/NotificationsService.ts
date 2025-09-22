import { CustomError } from "../errors/HttpError";
import { NotificationsRepository } from "../repositories/NotificationsRepository";

export class NotificationsService {
    constructor(private repository: NotificationsRepository) { }
    async createNotifications(id_actor: number, id_user: number, id_post: number, type: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para criar uma notificação.", 400, "MISSING_IDPOST")
        if (!id_user) throw new CustomError("ID do user é necessário para criar uma notificação.", 400, "MISSING_IDPOST")
        if (!id_actor) throw new CustomError("ID do ator é necessário para criar uma notificação.", 400, "MISSING_IDPOST")
        
        return await this.repository.insertNotification(id_user, id_actor, id_post, type)
    }
} 
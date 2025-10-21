import { CustomError } from "../errors/HttpError";
import { NotificationsRepository } from "../repositories/NotificationsRepository";

export class NotificationsService {
    constructor(private repository: NotificationsRepository) { }
    async createNotifications(id_actor: number, id_user: number, id_post: number, type: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para criar uma notificação.", 400, "MISSING_IDPOST")
        if (!id_user) throw new CustomError("ID do user é necessário para criar uma notificação.", 400, "MISSING_IDUSER")
        if (!id_actor) throw new CustomError("ID do ator é necessário para criar uma notificação.", 400, "MISSING_IDACTOR")

        return await this.repository.insertNotification(id_user, id_actor, id_post, type)
    }

    async getNotifications(id_user: number, mode: string) {
        if (!id_user) throw new CustomError("ID do user é necessário para criar uma notificação.", 400, "MISSING_IDPOST")
        if (!mode) throw new CustomError("Mode é necessarios para pesquisar por uma notificação.", 400, "MISSING_MODE")
        switch (mode) {
            case "postagem": { mode = "postagem"; break; }
            case "redacao": { mode = "redacao"; break; }
            case "denuncias": { mode = "denuncias"; break; }
            default: { mode = "postagem"; break; }
        }
        return await this.repository.selectNotification(mode, id_user)
    }
} 
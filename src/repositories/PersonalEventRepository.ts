import pool from "../db/connect";
import { CreatePersonalEventType, CreatePersonalLocalEventType } from "../db/types/PersonalEventType";


export class PersonalEventRepository {
    async insertPersonalEvent(data: CreatePersonalEventType) {
        const values = [data.id_user, data.day, data.month, data.year, data.title, data.cursinho, data.descricao, data.foto, data.link, data.type, data.color, data.main_title]

        const query = "INSERT INTO personal_events (id_user, day, month, year, title, cursinho, descricao, foto, link, type, color, main_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
        return await pool.query(query, values)
    }

    async getPersonalEventsById(id_user: string) {
        const values = [id_user]

        const query = "SELECT * FROM personal_events WHERE id_user = $1"
        return await pool.query(query, values)
    }

    async insertPersonalLocalEvent(data: CreatePersonalLocalEventType) {
        const values = [data.id_user, data.day, data.month, data.year, data.title, data.descricao, data.color, data.main_title, data.hora, data.isImportant]

        const query = "INSERT INTO personal_events (id_user, day, month, year, title, descricao, color, main_title, hora, isImportant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
        return await pool.query(query, values)
    }

    async deletePersonalEvent(id_event: string, id_user: string) {
        const values = [id_user, id_event]

        const query = "DELETE FROM personal_events WHERE id_user = $1 AND id_pevent = $2"
        return await pool.query(query, values)
    }

    async setPersonalEventImportant(condition: boolean, id_pevent: string) {
        const values = [condition, id_pevent]

        const query = "UPDATE personal_events SET isimportant = $1 WHERE id_pevent = $2"
        return await pool.query(query, values)
    }

    async checkPersonalEvent(id_user: string, id_pevent: string) {
        const values = [id_user, id_pevent]

        const query = "SELECT isimportant, isdone FROM personal_events WHERE id_user = $1 AND id_pevent = $2"
        return await pool.query(query, values)
    }

    async setPersonalEventDone(condition: boolean, id_pevent: string) {
        const values = [condition, id_pevent]

        const query = "UPDATE personal_events SET isdone = $1 WHERE id_pevent = $2"
        return await pool.query(query, values)
    }

    async editPersonalEvent(id_pevent: string, id_user: string, title: string, descricao: string, hora: string) {
        const values = [title, descricao, hora, id_user, id_pevent]

        const query = "UPDATE personal_events SET title = $1, descricao = $2, hora = $3 WHERE id_user = $4 AND id_pevent = $5"
        return await pool.query(query, values)
    }


}
import pool from "../db/connect";
import { CreateEventType } from "../db/types/EventsType";


export class EventsRepository {
    async createEvent(data: CreateEventType) {
        const values = [data.day, data.month, data.year, data.title, data.cursinho, data.descricao, data.link, data.color, data.type, data.main_title]

        const query = "INSERT INTO events_table (day, month, year, title, cursinho, descricao, link, color, type, main_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return pool.query(query, values)
    }

    async updatePhoto(foto: string, id: string) {
        const values = [foto, id]


        const query = "UPDATE events_table SET foto = $1 WHERE id_event = $2"
        return pool.query(query, values)
    }

    async getEvents() {
        const query = "SELECT * FROM events_table"
        return pool.query(query)
    }

    async insertCourseAdminEvent(id_cursinho: string, day: string, month: string, year: string, title: string, descricao: string, link: string, type: string, main_title: string, hora: string) {
        const query = `
                        INSERT INTO events_table (
                        id_cursinho, day, month, year, title, cursinho, descricao, foto, link, type, main_title, hora
                        )
                        SELECT 
                        c.id_cursinho,
                        $2, $3, $4, $5,
                        c.nome_exibido,
                        $6,
                        i.logo,
                        $7, $8, $9, $10
                        FROM cursinhos_table c
                        JOIN cursinhos_info_table i ON c.id_cursinho = i.id_cinfo
                        WHERE c.is_active = TRUE AND c.id_cursinho = $1
                        RETURNING *;`;
        const values = [id_cursinho, day, month, year, title, descricao, link, type, main_title, hora];
        return pool.query(query, values)
    }

    async deleteCourseEvent(id_event: string) {
        const values = [id_event]
        const query = "DELETE FROM events_table WHERE id_event = $1 AND id_cursinho "
        return pool.query(query, values)
    }

    async getCourseEventById(id_cursinho: string) {
        const values = [id_cursinho]

        const query = "SELECT * FROM events_table WHERE id_cursinho = $1 "
        return pool.query(query, values)
    }
}
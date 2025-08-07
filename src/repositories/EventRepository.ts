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
}
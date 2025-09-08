import pool from "../db/connect";

export class ReviewRepository {
    async insertReview(id_user: string, id_cursinho: string, stars: number, content: string) {
        const values = [id_user, id_cursinho, stars, content];

        const query = "INSERT INTO cursinho_avaliacoes (id_user, id_cursinho, stars, content) VALUES ($1, $2, $3, $4)";
        return pool.query(query, values);
    }
}
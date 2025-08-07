import pool from "../db/connect";
import { CustomError } from "../errors/HttpError";


export class AdminRepository {
    async selectAdmin(login: string, password: string) {
        const values = [login, password];

        const query = "SELECT * FROM admin_table WHERE login = $1 AND password = $2";
        return await pool.query(query, values);
    }

}
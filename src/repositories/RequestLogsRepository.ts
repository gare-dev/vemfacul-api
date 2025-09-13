import pool from "../db/connect"


export class RequestLogsRepository {
    async selectAdminLog() {
        const query = "SELECT * FROM request_logs ORDER BY timestamp DESC"
        return pool.query(query)
    }
}
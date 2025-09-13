import { CustomError } from "../errors/HttpError";
import { RequestLogsRepository } from "../repositories/RequestLogsRepository";


export class RequestLogsService {
    constructor(private repository: RequestLogsRepository) { }

    async selectAdminLog() {
        const log = await this.repository.selectAdminLog()

        if (log.rowCount === 0) throw new CustomError("Nenhum log encontrado.", 400, "LOG_NOTFOUND")

        return log.rows
    }
}
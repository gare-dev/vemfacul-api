import { QueryResult } from "@supabase/supabase-js";
import { CustomError } from "../errors/HttpError";
import { reportedPostsQueue } from "../queues/reportedPostsQueue";
import { ReportedPostsRepository } from "../repositories/ReportedPostsRepository";


export class ReportesPostsService {
    constructor(
        private reportedPostsRepository: ReportedPostsRepository,
    ) { }

    async reportPost(id_post: string, reported_by: string) {
        if (id_post.trim() === "" || reported_by.trim() === "") {
            throw new CustomError("Todos os campos são necessários", 400, "MISSING_FIELDS");
        }

        const post = await this.reportedPostsRepository.findPostById(id_post);

        if (post.rowCount === 0) {
            throw new CustomError("Post não encontrado", 404, "POST_NOT_FOUND");
        }
        const reported_post = await this.reportedPostsRepository.reportPost(id_post, reported_by, post.rows[0].content)

        await Promise.all([
            reportedPostsQueue.add("sendReportNotification", { post: post.rows[0].content, reported_by, id_user: reported_by, id_post: reported_post.rows[0].id_reported_post })
        ])
    }
}
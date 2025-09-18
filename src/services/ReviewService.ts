import { JWTClass } from "../../utils/jwt";
import { Redis } from "../../utils/redis";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { CustomError } from "../errors/HttpError";


export class ReviewService {
    constructor(
        private repository: ReviewRepository,
        private jwtHandler: JWTClass,
        private redis: Redis
    ) { }

    async insertReview(id_user: string, id_cursinho: string, stars: number, content: string) {
        if (!id_user || !id_cursinho || !content) {
            throw new CustomError("All fields are required", 400, "MISSING_FIELDS");
        }

        if (stars > 5) throw new CustomError("Invalid stars rating", 400, "INVALID_STARS");
        if (content.trim().length > 500) throw new CustomError("Content is too long", 400, "INVALID_CONTENT");

        return this.repository.insertReview(id_user, id_cursinho, stars, content);
    }
}
import { CustomError } from "../errors/HttpError";
import { PostsRepository } from "../repositories/PostRepository";


export class PostService {
    constructor(private repository: PostsRepository) { }

    async createPost(id_user: string, content: string) {
        if (!content) throw new CustomError("Post não pode ser vazio!", 400, "EMPTY_POST")

        return await this.repository.createPost(id_user, content)
    }

    async getPostByUsername(username: string) {
        if (!username) throw new CustomError("O usuário é necessário para obter os posts do usuário.", 400, "MISSING_USERNAME")

        const posts = await this.repository.getPostagemByUsername(username)

        if (posts.rowCount === 0) throw new CustomError("Esse usuário não tem posts.", 204, "MISSING_USERNAME")

        return posts.rows
    }

    async likePost(id_post: string, id_user: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para curtir um post.", 400, "MISSING_IDPOST")
        if (!id_user) throw new CustomError("ID do usuário é necessário para curtir um post.", 400, "MISSING_IDUSER")

        return await this.repository.likePost(id_post, id_user)
    }

    async unlikePost(id_post: string, id_user: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para curtir um post.", 400, "MISSING_IDPOST")
        if (!id_user) throw new CustomError("ID do usuário é necessário para curtir um post.", 400, "MISSING_IDUSER")

        return await this.repository.unlikePost(id_post, id_user)
    }

    async getLikesCount(id_post: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para curtir um post.", 400, "MISSING_IDPOST")

        const likes = await this.repository.getLikesCount(id_post)

        if (likes.rowCount === 0) throw new CustomError("Não há curtidas nesse post.", 400, "NO_POSTS")

        return likes.rows
    }

    async selectAllPosts() {

        const posts = await this.repository.selectAllPosts()

        if (posts.rowCount === 0) throw new CustomError("Não há posts.", 400, "NO_POSTS")

        return posts
    }
}
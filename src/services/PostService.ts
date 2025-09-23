import { CustomError } from "../errors/HttpError";
import { PostsRepository } from "../repositories/PostRepository";
import { NotificationsService } from "./NotificationsService";
export class PostService {
    constructor(private repository: PostsRepository, private NotificationService: NotificationsService) { }

    async createPost(id_user: string, content: string) {
        if (!content) throw new CustomError("Post não pode ser vazio!", 400, "EMPTY_POST")

        return await this.repository.createPost(id_user, content)
    }

    async getPostByUsername(id_user: string, username: string) {
        if (!username) throw new CustomError("O usuário é necessário para obter os posts do usuário.", 400, "MISSING_USERNAME")

        const posts = await this.repository.getPostagemByUsername(id_user, username)

        return posts.rows
    }

    async likePost(id_post: string, id_user: string) {
        if (!id_post) throw new CustomError("ID do post é necessário para curtir um post.", 400, "MISSING_IDPOST")
        if (!id_user) throw new CustomError("ID do usuário é necessário para curtir um post.", 400, "MISSING_IDUSER")

        const post = await this.repository.likePost(id_post, id_user)

        const id_destinatario = +post.rows[0].id_destinatario
        console.log(id_destinatario)
        await this.NotificationService.createNotifications(Number(id_user), id_destinatario, Number(id_post), "Curtida");

        if (post.rowCount && post.rowCount === 0) throw new CustomError("Usuário já curtiu essa postagem.", 400, "ALREADY_LIKED")
        
        return post
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

    async selectAllPosts(id_user: number) {
        const posts = await this.repository.selectAllPosts(id_user)

        return posts
    }

    async getSinglePost(id_user: string, id_post: string) {
        if (!id_user) throw new CustomError("ID User é necessário para selecionar o post", 400, "IDUSER_MISSING")
        if (!id_post) throw new CustomError("ID Post é necessário para seleceionar o post", 400, "IDPOST_MISSING")

        const posts = await this.repository.selectSinglePost(id_user, id_post)

        if (posts.rowCount && posts.rowCount === 0) throw new CustomError("Nenhum post encontrado", 404, "POST_NOTFOUND")

        return posts
    }

    async createComment(content: string, postagem_pai: number, id_user: number) {
        if (!content) throw new CustomError("Conteúdo do post é necessário para fazer a postagem.", 400, "CONTENT_MISSING")
        if (!postagem_pai) throw new CustomError("ID Father é necessário para fazer o post", 400, "IDFATHER_MISSING")
        const comment = await this.repository.createComment(content, postagem_pai, id_user)
        const id_destinatario = comment.rows[0].id_destinatario
        console.log(id_destinatario, id_user, postagem_pai)
        return await this.NotificationService.createNotifications(id_user, id_destinatario, postagem_pai, "Comentário")
    }

    async selectComment(id_pai: string) {
        if (!id_pai) throw new CustomError("ID Pai é necessário para o selectComment", 400, "IDPAI_MISSING")

        const comment = await this.repository.selectComments(id_pai)

        if (comment.rowCount && comment.rowCount === 0) throw new CustomError("Nenhum comentário encontrado", 400, "COMMENT_NOTFOUND")

        return comment.rows
    }
}
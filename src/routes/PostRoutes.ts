import express, { NextFunction, Request, Response } from "express"
import { PostService } from "../services/PostService"
import { PostsRepository } from "../repositories/PostRepository"
import { NotificationsService } from "../services/NotificationsService"
import { NotificationsRepository } from "../repositories/NotificationsRepository"
import authGuard from "../middleware/authGuard"

const router = express.Router()
const service = new PostService(new PostsRepository(), new NotificationsService(new NotificationsRepository()))

router.post("/user/post", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body
        const id_user = req.user.id

        await service.createPost(id_user, content)

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.get("/user/:username/post", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username
        const id_user = req.user.id

        const posts = await service.getPostByUsername(id_user, username)

        return res.status(200).json({
            data: posts
        })
    } catch (err) {
        next(err)
    }
})

router.patch("/user/post/like", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_postagem } = req.body
        const id_user = req.user.id

        await service.likePost(id_postagem, id_user)

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.patch("/user/post/unlike", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_postagem } = req.body

        const id_user = req.user.id

        await service.unlikePost(id_postagem, id_user)

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.get("/user/post/:post/like", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_post = req.params.post

        const likes = await service.getLikesCount(id_post)

        return res.status(200).json({
            message: "Likes encontrados com sucesso.",
            data: likes
        })
    } catch (err) {
        next(err)
    }
})

router.get("/post", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_user = +req.user.id
        const posts = await service.selectAllPosts(id_user)

        return res.status(200).json({
            data: posts.rows
        })
    } catch (err) {
        next(err)
    }
})

router.get("/post/:post", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_post = req.params.post
        const id_user = req.user.id

        const post = await service.getSinglePost(id_user, id_post)

        return res.status(200).json({
            code: "POSTAGENS_FOUND",
            data: post.rows
        })

    } catch (err) {
        next(err)
    }
})

router.post("/coment", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_user = +req.user.id
        const { content, postagem_pai } = req.body

        await service.createComment(content, postagem_pai, id_user)
        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }

})

router.get("/post/coment/:id", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_pai = req.params.id
        const id_user = +req.user.id
        const coments = await service.selectComment(id_pai, id_user)

        return res.status(200).json({
            data: coments
        })

    } catch (err) {
        next(err)
    }
})

router.delete("/user/post/:id_postagem", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_post = req.params.id_postagem
        const id_user = req.user.id

        await service.deletePost(id_post, id_user)

        return res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

export default router
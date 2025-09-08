import express, { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { JWTClass } from "../../utils/jwt";
import sendConfirmationEmail from "../emails/createAccountEmail"
import { Redis } from "../../utils/redis";
import { MulterFile } from "../../utils/uploadPhoto";
import authGuard from "../middleware/authGuard";
import upload from "../config/multer";
import { CustomError } from "../errors/HttpError";

const router = express.Router()
const service = new UserService(new UserRepository(), new JWTClass(process.env.SECRET!), new Redis())

// FIXME Adicionar função para validar TODOS os campos que entrem com uma string.

router.post("/user/email", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const token = await service.createUser({ email, password })

        sendConfirmationEmail(email, token!)
        return res.status(201).json({
            message: "Conta criada, cheque o seu email.",
            code: "ACCOUNT_CREATED_CHECK_EMAIL"
        })
    } catch (err) {
        next(err)
    }
})

router.post("/user/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const token = await service.loginUser({ email, password })

        res.status(200).cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", domain: process.env.DOMAIN, path: "/" }).json({
            message: "Login realizado com sucesso!",
            code: "LOGIN_SUCCESS",
            auth: token
        })
    } catch (err) {
        next(err)
    }
})

router.get("/user/profile/info", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        const user_info = await service.profileInfo(token)

        res.status(200).json({
            code: "PROFILE_INFO",
            data: user_info
        })
    } catch (err) {
        next(err)
    }

})

router.patch("/user/auth/confirm", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body

        await service.confirmAccount(token)

        return res.status(200).json({
            message: "Conta confirmada com sucesso!",
            code: "CONFIRMED_ACCOUNT"
        })
    } catch (err) {
        next(err)
    }

})

router.post("/user/forgot-password/email", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        await service.resetPasswordEmail(email)

        return res.status(200).json({
            message: "Email enviado com sucesso!",
            code: "EMAIL_SENT"
        })
    } catch (err) {
        next(err)
    }
})

router.patch("/user/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, cryptrEmail } = req.body

        await service.resetPassword(password, cryptrEmail)

        return res.status(200).json({
            message: "Senha alterada com sucesso!",
            code: "PASSWORD_CHANGED"
        })
    } catch (err) {
        console.log(err)
        next(err)
    }

})

router.post("/user/register", upload.single("imagem"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = JSON.parse(req.body.userData)
        const {
            nome, estado, nivel, escola, ano, vestibulares, passouVestibular,
            universidade, curso, formouEM, trabalha, instituicao, materiasLecionadas, email
        } = userData
        const photo = req.file as MulterFile

        const token = await service.registerAccount({ email, materiasLecionadas, trabalha, ano, curso, escola, estado, formouEM, instituicao, nivel, nome, passouVestibular, universidade, vestibulares }, photo)

        return res.status(201).cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", domain: process.env.DOMAIN, path: "/" }).json({
            message: "Conta registrada com sucesso!",
            code: "REGISTERED_ACCOUNT"
        });
    } catch (err) {
        next(err)
    }

})

router.get("/user/:username/profile", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params

        const user_profile = await service.userProfile(username)

        return res.status(200).json({
            code: "USER_FOUND",
            data: user_profile
        })

    } catch (err) {
        next(err)
    }
})

router.patch("/user/profile/change-photo", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photo = req.file as MulterFile
        const token = req.cookies.token;

        await service.changeUserPhoto(photo, token!)

        return res.status(200).json({
            message: "Foto atualizada com sucesso!",
            code: "PHOTO_UPDATED"
        });
    } catch (err) {
        next(err)
    }
})

router.put("/user/profile/edit", upload.fields([{ name: "foto", maxCount: 1 }, { name: "header", maxCount: 1 }]), authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = JSON.parse(req.body.userData)
        const token = req.cookies.token;
        const { name, descricao } = userData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const headerImage = files["header"]?.[0];
        const profileImage = files["foto"]?.[0];

        await service.editProfile(name, descricao, headerImage, profileImage, token)

        return res.status(200).json({
            message: "Perfil editado com sucesso!",
            code: "PROFILE_EDITED",
        });

    } catch (err) {
        next(err)
    }
})

router.get("/user/validate", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        const validated_user = await service.validateProfile(token!)

        return res.status(200).json({
            code: "PROFILE_VALIDATED",
            data: {
                nome: validated_user.nome,
                username: validated_user.username,
            }
        });

    } catch (err) {

        next(err)
    }
})

router.get("/token/teste", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        console.log(req.cookies)
        if (!token) {
            return res.status(401).json({ message: "Token não encontrado" });
        }

        return res.status(200).json({ message: "Token válido", token });
    } catch (err) {
        next(err);
    }
})

router.delete("/user/auth", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) throw new CustomError("Token não encontrado.", 401, "TOKEN_NOT_FOUND");

        return res.status(200).cookie("token", "", { expires: new Date(0) }).json({
            message: "Token removido com sucesso!",
            code: "TOKEN_REMOVED"
        });
    } catch (err) {
        next(err)
    }
})

export default router
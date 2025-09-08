import { JWTClass } from "../../utils/jwt";
import { CreateUserType, RegisterUserType } from "../db/types/UserType";
import { CustomError } from "../errors/HttpError";
import { UserRepository } from "../repositories/UserRepository";
import { Redis } from "../../utils/redis";
import sendForgotPasswordEmail from "../emails/forgotPasswordAccount";
import cryptr from "../config/cryptr";
import uploadPhoto, { MulterFile } from "../../utils/uploadPhoto"
import uploadToSupabase from "../../utils/uploadSupabasePhoto"

export class UserService {
    constructor(
        private repository: UserRepository,
        private jwtHandler: JWTClass,
        private redis: Redis
    ) { }

    async createUser(user: CreateUserType) {
        if (!user.email) throw new CustomError("Email é necessário para o cadastro.", 400, "EMAIL_MISSING")
        if (!user.password) throw new CustomError("Senha é necessário para o cadastro.", 400, "PWD_MISSING")

        try {
            const response = await this.repository.create(user)

            if (response.rowCount === 0) {
                throw new CustomError("Perfil não criado, tente novamente mais tarde.", 400, "UNKNOWN_ERROR")
            }
            if (response.rowCount! > 0) {
                console.log("Usuário criado com sucesso.")
            }
            return this.jwtHandler.generateJWT({ email: user.email })
        } catch (err: unknown) {
            if ((err as { code: string })?.code === "23505") {
                throw new CustomError("Já existe uma conta com esse email.", 409, "ALREADYUSED_EMAIL")
            }
            throw err
        }
    }

    async loginUser(user: CreateUserType) {
        if (!user.email) throw new CustomError("Email é necessário para fazer login.", 400, "EMAIL_MISSING")
        if (!user.password) throw new CustomError("Senha é necessário para fazer login.", 400, "PWD_MISSING")

        const response = await this.repository.loginUser(user)

        if (response.rowCount === 0) {
            throw new CustomError("Email ou senha incorretos.", 400, "INVALID_EMAIL_OR_PASSWORD")
        }

        const { id_user, nome, username } = response.rows[0];

        const token = this.jwtHandler.generateJWT({ id: id_user, email: user.email },)
        await this.redis.setRedis(`user_${id_user}`, { id: id_user, email: user.email, nome: nome, username: username }, 2 * 24 * 60 * 60)

        return token
    }

    async profileInfo(token: string) {
        const decoded_token = this.jwtHandler.verifyJWT(token)

        const cachedProfile = await this.redis.getRedis(`user_profile_${decoded_token?.id}`)
        if (cachedProfile) {
            return cachedProfile
        }
        const response = await this.repository.profileInfo(decoded_token?.id!)

        await this.redis.setRedis(`user_profile_${decoded_token?.id}`, response.rows[0], 2 * 24 * 60 * 60)
        console.log("⌛ Cache set for user profile")

        return response.rows[0]
    }

    async confirmAccount(token: string) {
        if (!token) throw new CustomError("É necessário um token válido para a verificação da conta.", 400, "MISSING_TOKEN")
        const decoded_token = this.jwtHandler.verifyJWT(token)

        if (!decoded_token) throw new CustomError("Token para validar conta inválido.", 400, "INVALID_TOKEN")

        return await this.repository.confirmAccount(decoded_token?.email)
    }

    async resetPasswordEmail(email: string) {
        if (!email) throw new CustomError("O email é necessário para resetar a senha.", 400, "MISSING_EMAIL")

        const user = await this.repository.resetPasswordEmail(email)

        if (user.rowCount && user.rowCount < 1) {
            throw new CustomError("Email não encontrado", 404, "EMAIL_NOT_FOUND")
        }
        return sendForgotPasswordEmail(email)
    }

    async resetPassword(password: string, encryptedEmail: string) {
        if (!password) throw new CustomError("A senha é necessário para resetar a senha.", 400, "MISSING_PWD")
        if (!encryptedEmail) throw new CustomError("Não foi possível resetar a senha.", 400, "RESET_ERROR")

        try {
            const email = cryptr.decrypt(encryptedEmail)

            return console.log(await this.repository.resetPassword(password, email))
        } catch (err: unknown) {
            if ((err as { code: string })?.code === "ERR_CRYPTO_INVALID_IV") {
                throw new CustomError("Não foi possível resetar a senha.", 400, "RESET_ERROR")
            }
            throw new CustomError("Não foi possível resetar a senha.", 400, "RESET_ERROR")
        }
    }

    async registerAccount(user: RegisterUserType, photo: MulterFile) {
        if (!photo) throw new CustomError("É necessário a foto do usuário para registrar a foto de perfil.", 400, "MISSING_PHOTO")

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new CustomError("Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.", 400, "INVALID_IMG_FORMAT")
        }
        const image_url = await uploadPhoto(photo, user.email)

        await this.repository.updateUserPhoto({ email: this.jwtHandler.verifyJWT(user.email)?.email as string, imageURL: image_url })

        const response = await this.repository.registerAccount({ ...user, email: this.jwtHandler.verifyJWT(user.email)?.email as string })



        const { id_user, nome, username } = response?.rows[0];

        const token = this.jwtHandler.generateJWT({ id: id_user, email: user.email },)
        await this.redis.setRedis(`user_${id_user}`, { id: id_user, email: user.email, nome: nome, username: username }, 2 * 24 * 60 * 60)

        return token
    }

    async userProfile(username: string) {
        if (!username) throw new CustomError("É necessário o nome de usuário para obter suas informações.", 400, "MISSING_USERNAME")

        const user_profile = await this.repository.userProfile(username)

        if (user_profile.rowCount === 0) {
            throw new CustomError("Usuário não encontrado.", 404, "USER_NOT_FOUND")
        }

        return user_profile.rows
    }

    async changeUserPhoto(photo: MulterFile, token: string) {
        if (!photo) throw new CustomError("É necessário a foto do usuário para atualizar a foto de perfil.", 400, "MISSING_PHOTO")

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new CustomError("Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.", 400, "INVALID_IMG_FORMAT")
        }

        const decoded_token = this.jwtHandler.verifyJWT(token)
        const image_url = await uploadPhoto(photo, decoded_token?.email!)

        const user = await this.repository.changeUserPhoto(image_url, decoded_token?.id!)

        if (user.rowCount === 1) {
            await this.redis.setRedis(`user_profile_${decoded_token?.id}`, null, 60 * 60)
        }
    }

    async editProfile(name: string, descricao: string, headerImage: Express.Multer.File, profilePhoto: Express.Multer.File, token: string) {
        const decoded_token = this.jwtHandler.verifyJWT(token)

        let fotoUrl = null;
        let headerUrl = null;

        if (profilePhoto && headerImage) {
            const [header, foto] = await Promise.all([
                uploadToSupabase(headerImage, 'header', decoded_token!.email),
                uploadToSupabase(profilePhoto, 'image', decoded_token!.email),
            ]);
            headerUrl = header;
            fotoUrl = foto;
        } else if (profilePhoto) {
            fotoUrl = await uploadToSupabase(profilePhoto, 'image', decoded_token!.email);
        } else if (headerImage) {
            headerUrl = await uploadToSupabase(headerImage, 'header', decoded_token!.email);
        }

        const updateFields: { nome: string; descricao?: string; foto?: string | null; header?: string | null } = { nome: name };

        if (descricao) updateFields.descricao = descricao;
        if (fotoUrl) updateFields.foto = fotoUrl;
        if (headerUrl) updateFields.header = headerUrl;

        const edited_profile = await this.repository.editProfile(updateFields, decoded_token?.id!)

        if (edited_profile.rowCount && edited_profile.rowCount > 0) {
            await this.redis.setRedis(`user_profile_${decoded_token?.id}`, null, 60 * 60);
        }
    }

    async validateProfile(token: string) {
        const decoded_token = this.jwtHandler.verifyJWT(token)
        const id = decoded_token?.id

        const cachedUser = await this.redis.getRedis(`user_${id}`);

        if (cachedUser) {
            return cachedUser as { nome: string, username: string }
        }

        throw new CustomError("Perfil não validado.", 400, "PROFILE_NOTVALIDATED")
    }


}
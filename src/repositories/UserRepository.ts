import { CreateUserType, RegisterUserType, UpdateUserPhotoType } from "../db/types/UserType";
import pool from "../db/connect"

export class UserRepository {
    async create(user: CreateUserType) {
        const values = [user.password, user.email]

        const query = "INSERT INTO users_table (senha, email) VALUES ($1, $2)"
        return await pool.query(query, values)
    }

    async loginUser(user: CreateUserType) {
        const values = [user.password, user.email]

        const query = "SELECT * FROM users_table WHERE senha = $1 AND email = $2";
        return await pool.query(query, values);
    }

    async profileInfo(id_user: number) {
        const values = [id_user]

        const query = "SELECT nome, username, foto, role FROM users_table WHERE id_user = $1"
        return await pool.query(query, values)
    }

    async confirmAccount(email: string) {
        const values = [email]

        const query = "UPDATE users_table SET is_verified = TRUE WHERE email = $1"
        return await pool.query(query, values)
    }

    async resetPasswordEmail(email: string) {
        const values = [email]

        const query = "SELECT * FROM users_table WHERE email = $1";
        return await pool.query(query, values)
    }

    async resetPassword(password: string, email: string) {
        const values = [password, email]

        const query = "UPDATE users_table SET senha = $1 WHERE email = $2"
        return await pool.query(query, values)
    }

    async registerAccount(user: RegisterUserType) {
        const values = [user.nome, user.estado, user.nivel]

        switch (values[2]) {
            case "Aluno EM":
                console.log(user.email)
                values.push(user.escola, user.ano, user.vestibulares, user.email, user.username)
                return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, escola = $4, ano = $5, vestibulares = $6, username = $8 WHERE email = $7 RETURNING id_user, nome, username", values)
            case "Universitário":
                values.push(user.passouVestibular, user.universidade, user.curso, user.email, user.username)

                return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, passouVestibular = $4, universidade_estuda = $5, curso = $6, username = $8 WHERE email = $7 RETURNING id_user, nome, username", values)
            case "Vestibulando":
                values.push(user.formouEM, user.trabalha, user.vestibulares, user.email, user.username)

                return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, formouEM = $4, trabalha = $5, vestibulares = $6, username = $8 WHERE email = $7 RETURNING id_user, nome, username", values)
            case "Professor":
                values.push(user.instituicao, user.materiasLecionadas, user.email, user.username)

                return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, instituicao = $4, materias_lecionadas = $5, username = $7 WHERE email = $6 RETURNING id_user, nome, username", values)
        }
    }

    async updateUserPhoto(data: UpdateUserPhotoType) {
        const values = [data.imageURL, data.email]

        const query = "UPDATE users_table SET foto = $1 WHERE email = $2"
        return await pool.query(query, values)
    }

    async userProfile(username: string) {
        const values = [username]

        const query = "SELECT nome, username, foto, header, descricao, posts_number, vestibulares, materias_lecionadas, nivel FROM users_table WHERE username = $1"
        return await pool.query(query, values)
    }

    async changeUserPhoto(photo: string, id_user: number) {
        const values = [photo, id_user]

        const query = "UPDATE users_table SET foto = $1 WHERE id_user = $2"
        return await pool.query(query, values)
    }

    async editProfile(fields: any, id_user: number) {
        const setParts = [];
        const values = [];
        let i = 1;

        for (const [key, value] of Object.entries(fields)) {
            setParts.push(`${key} = $${i}`);
            values.push(value);
            i++;
        }

        if (setParts.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
        }

        const query = `UPDATE users_table SET ${setParts.join(', ')} WHERE id_user = $${i}`;
        values.push(id_user);

        return await pool.query(query, values);
    }

    async getAdminUsers() {

        const query = "SELECT id_user, nome, email, created_at, username, foto, is_verified, role, senha FROM users_table ORDER BY created_at DESC"
        return await pool.query(query)
    }

    async setAdminUserVerify(value: boolean, id_user: string) {
        const values = [value, id_user]

        const query = "UPDATE users_table SET is_verified = $1 WHERE id_user = $2"
        return await pool.query(query, values)
    }

    async setAdminUserRole(id_user: string, role: string) {
        const values = [role, id_user]

        const query = "UPDATE users_table SET role = $1 WHERE id_user = $2"
        return await pool.query(query, values)
    }
}

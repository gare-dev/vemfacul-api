import pool from "../db/connect";
import { CreateCourseType } from "../db/types/CourseType";


export class CourseRepository {
    async insertCourse(data: CreateCourseType) {
        const values = [data.id_endereco, data.id_cinfo, data.nome, data.nome_exibido, data.cnpj, data.representante_legal, data.email_contato, data.telefone, data.site];

        const query = "INSERT INTO cursinhos_table (id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        return pool.query(query, values);
    }

    async selectAdminCourse() {
        const query = `
        SELECT 
            c.nome,
            c.nome_exibido,
            c.cnpj,
            c.representante_legal,
            c.email_contato,
            c.telefone,
            c.site,
            c.id_cursinho,
            i.logo
        FROM 
            cursinhos_table c
        JOIN 
            cursinhos_info_table i ON c.id_cinfo = i.id_cinfo
        WHERE 
            c.is_active = FALSE
        ORDER BY 
            c.created_at DESC;`
        return await pool.query(query);
    }

    async approveCourse(id_course: string) {
        const values = [id_course];

        const query = "UPDATE cursinhos_table SET is_active = TRUE WHERE id_cursinho = $1";
        return await pool.query(query, values);
    }


}
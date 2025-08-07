import pool from "../db/connect";
import { CreateCourseAddressType } from "../db/types/CourseType";


export class CourseAddressRepository {
    insertCourseAddress(data: CreateCourseAddressType) {
        const values = [data.rua, data.numero, data.bairro, data.cidade, data.cep, data.estado, data.uf, data.regiao];

        const query = "INSERT INTO cursinhos_endereco_table (rua, numero, bairro, cidade, cep, estado, uf, regiao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_endereco";
        return pool.query(query, values);
    }
}
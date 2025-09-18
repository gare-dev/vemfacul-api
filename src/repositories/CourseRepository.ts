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
    const query2 = "UPDATE users_table SET is_verified = TRUE WHERE id_cursinho = $1 AND role = 'dono de cursinho' RETURNING email";

    const [res1, res2] = await Promise.all([
      pool.query(query, values),
      pool.query(query2, values)
    ]);
    return res2.rows[0]
  }

  async getCourse() {
    const query = `SELECT 
  c.id_cursinho,
  c.nome,
  c.nome_exibido,
  l.cidade,
  l.uf,
  i.faixa_preco,
  i.logo,
  l.estado,
  l.regiao,
  i.modalidades,
  i.disciplinas_foco,
  i.tem_bolsa,
  i.aceita_programas_publico,

  (
  SELECT 
    AVG(stars) as media
  FROM 
    cursinho_avaliacoes
  WHERE
  c.id_cursinho = cursinho_avaliacoes.id_cursinho
  ),
  (
  SELECT 
    COUNT(*) as total_avaliacoes
  FROM 
    cursinho_avaliacoes
  WHERE
    c.id_cursinho = cursinho_avaliacoes.id_cursinho
  )
FROM 
  cursinhos_table c
JOIN 
  cursinhos_info_table i ON c.id_cursinho = i.id_cinfo
JOIN
  cursinhos_endereco_table l ON l.id_endereco = c.id_endereco
WHERE 
  c.is_active = TRUE
ORDER BY 
  c.created_at
`
    return await pool.query(query);
  }

  async getCourseById(id_course: string) {
    const values = [id_course];

    const query = `
SELECT 
  c.id_cursinho,
  c.nome,
  c.nome_exibido,
  l.rua,
  l.numero,
  l.bairro,
  l.cep,
  l.regiao,
  l.cidade,
  l.uf,
  c.telefone,
  c.email_contato,
  c.site,
  i.modalidades,
  i.disciplinas_foco,
  i.media_alunos,
  i.faixa_preco,
  i.tem_bolsa,
  i.aceita_programas_publico,
  i.diferenciais,
  i.descricao,
  i.logo,
  i.imagens_espaco,
  json_agg(
    json_build_object(
      'id_user', u.id_user,
      'name', u.nome, 
      'pfp', u.foto,
      'stars', a.stars,
      'content', a.content,
      'created_at', a.created_at
    )
  ) AS avaliacoes
FROM cursinhos_table c
JOIN cursinhos_info_table i ON c.id_cursinho = i.id_cinfo
JOIN cursinhos_endereco_table l ON l.id_endereco = c.id_endereco
LEFT JOIN cursinho_avaliacoes a ON a.id_cursinho = c.id_cursinho
LEFT JOIN users_table u ON a.id_user = u.id_user
WHERE c.is_active = TRUE AND c.id_cursinho = $1
GROUP BY 
  c.id_cursinho, c.nome, c.nome_exibido, l.rua, l.numero, l.bairro, l.cep, 
  l.regiao, l.cidade, l.uf, c.telefone, c.email_contato, c.site,
  i.modalidades, i.disciplinas_foco, i.media_alunos, i.faixa_preco,
  i.tem_bolsa, i.aceita_programas_publico, i.diferenciais, i.descricao,
  i.logo, i.imagens_espaco
ORDER BY c.created_at;

`
    return await pool.query(query, values);
  }

  async getBestCourses() {
    const query = `SELECT 
    c.nome_exibido,
    e.uf,
    i.logo,
    AVG(a.stars) AS media_stars
FROM 
    cursinhos_table c 
JOIN cursinhos_endereco_table e ON c.id_endereco = e.id_endereco
JOIN cursinhos_info_table i ON c.id_cinfo = i.id_cinfo
JOIN cursinho_avaliacoes a ON c.id_cursinho = a.id_cursinho
WHERE 
    c.is_active = TRUE
GROUP BY 
    c.id_cursinho, c.nome_exibido, e.uf, i.logo
ORDER BY 
    media_stars DESC
LIMIT 3;
`
    return await pool.query(query)
  }


}


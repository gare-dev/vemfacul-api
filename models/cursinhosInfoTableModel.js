const pool = require("../config/db")

const cursinhosInfoTableModel = {
    insertCursinhoInfo: (modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logo, imagens_espaco) => {
        const values = [modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logo, imagens_espaco];

        try {
            const query = "INSERT INTO cursinhos_info_table (modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logo, imagens_espaco) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_cinfo";
            return pool.query(query, values);
        } catch (error) {
            console.error("Error inserting cursinho info:", error);
            throw error;
        }
    }
}

module.exports = cursinhosInfoTableModel;
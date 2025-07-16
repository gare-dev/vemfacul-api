const pool = require("../config/db")

const cursinhosTableModel = {
    insertCursinho: (id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) => {
        const values = [id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site];

        try {
            const query = "INSERT INTO cursinhos_table (id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
            return pool.query(query, values);
        } catch (error) {
            console.error("Error inserting cursinho:", error);
            throw error;
        }
    }
}

module.exports = cursinhosTableModel
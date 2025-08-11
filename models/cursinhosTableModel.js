const pool = require("../config/db")

const cursinhosTableModel = {
    insertCursinho: async (id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) => {
        const values = [id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site];

        try {
            const query = "INSERT INTO cursinhos_table (id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
            return pool.query(query, values);
        } catch (error) {
            console.error("Error inserting cursinho:", error);
            throw error;
        }
    },

    selectAdminCursinhos: async () => {
        try {
            const query = `SELECT 
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
                                c.created_at DESC;
                            `
            return await pool.query(query);
        } catch (error) {
            throw new Error("Error selecting admin cursinhos: " + error);
        }
    },

    aproveAdminCursinho: async (id_cursinho) => {
        const values = [id_cursinho];

        try {
            const query = "UPDATE cursinhos_table SET is_active = TRUE WHERE id_cursinho = $1";
            return await pool.query(query, values);
        } catch (error) {
            throw new Error("Error approving cursinho: " + error);
        }
    },
}

module.exports = cursinhosTableModel
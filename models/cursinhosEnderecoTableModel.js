const pool = require("../config/db")



const cursinhosEnderecoTableModel = {
    insertCursinhoEndereco: (rua, numero, bairro, cidade, cep, estado, uf, regiao) => {
        const values = [rua, numero, bairro, cidade, cep, estado, uf, regiao];

        try {
            const query = "INSERT INTO cursinhos_endereco_table (rua, numero, bairro, cidade, cep, estado, uf, regiao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_endereco";
            return pool.query(query, values);
        } catch (error) {
            console.error("Error inserting cursinho endereco:", error);
            throw error;
        }
    }
}

module.exports = cursinhosEnderecoTableModel;
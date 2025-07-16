const cursinhosEnderecoTableModel = require("../models/cursinhosEnderecoTableModel");
const cursinhosInfoTableModel = require("../models/cursinhosInfoTableModel");
const cursinhosTableModel = require("../models/cursinhosTableModel");
const supabase = require("../config/supabaseClient")

const cursinhosTableController = {
    insertCursinho: async (req, res) => {
        const data = JSON.parse(req.body.data);
        const { instituicao, endereco, academico, financeiro, imagens, login } = data
        const { rua, numero, bairro, cidade, cep, estado, uf, regiao } = endereco;
        const { diferenciais, disciplinasFoco, mediaAlunosPorTurma, modalidades } = academico;
        const { faixaPreco, temBolsa, aceitaProgramasPublicos } = financeiro;
        const { cnpj, emailContato, nome, nomeExibido, representanteLegal, site, telefone } = instituicao
        const { email, password } = login
        const logo = req.files?.['logo'][0]
        const imgs = req.files?.['imagens']

        try {
            const id_endereco = await insertCursinhoEndereco(rua, numero, bairro, cidade, cep, estado, uf, regiao);
            const id_cinfo = await insertCursinhoInfo(modalidades, disciplinasFoco, mediaAlunosPorTurma, diferenciais, faixaPreco, temBolsa, aceitaProgramasPublicos, instituicao.descricao, logo, imgs, nomeExibido);
            const cursinhoInserted = await insertCursinho(id_endereco, id_cinfo, nome, nomeExibido, cnpj, representanteLegal, emailContato, telefone, site);

            if (cursinhoInserted) {
                return res.status(201).json({
                    message: "Cursinho inserido com sucesso!",
                    code: "CURSINHO_INSERTED"
                });
            } else {
                return res.status(500).json({ message: "Erro ao inserir cursinho." });
            }

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },
}

async function insertCursinhoEndereco(rua, numero, bairro, cidade, cep, estado, uf, regiao) {
    try {
        const response = await cursinhosEnderecoTableModel.insertCursinhoEndereco(rua, numero, bairro, cidade, cep, estado, uf, regiao)
        if (response.rowCount >= 1) {
            return response.rows[0].id_endereco;
        }
    } catch (error) {
        throw new Error("Error inserting cursinho endereco.")
    }
}

async function insertCursinhoInfo(modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logo, imagens_espaco, nomeExibido) {
    let imagensUrl = []
    let logoUrl = null;

    try {
        imagensUrl = await Promise.all(imagens_espaco.map(async (file) => {
            return uploadPhoto(file, nomeExibido);
        }));
        logoUrl = await uploadPhoto(logo, nomeExibido);

        const response = await cursinhosInfoTableModel.insertCursinhoInfo(modalidades, disciplinas_foco, media_alunos, diferenciais, faixa_preco, tem_bolsa, aceita_programas_publico, descricao, logoUrl, imagensUrl)

        if (response.rowCount >= 1) {
            return response.rows[0].id_cinfo;
        }
    } catch (error) {

        throw new Error("Error inserting cursinho info. " + error)
    }
}

async function insertCursinho(id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site) {

    try {
        const response = await cursinhosTableModel.insertCursinho(id_endereco, id_cinfo, nome, nome_exibido, cnpj, representante_legal, email_contato, telefone, site)
        if (response.rowCount >= 1) {
            return true;
        }
    } catch (error) {
        throw new Error("Error inserting cursinho.")
    }
}

const uploadPhoto = async (file, nomeExibido) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Formato de imagem inválido. Apenas JPEG, PNG e GIF são permitidos.`);
    }


    const filePath = `${nomeExibido}/${nomeExibido}_${file.originalname}`;

    const { error: uploadError } = await supabase.storage
        .from("cursinho-imagens")
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro ao enviar para o Supabase: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from("cursinho-imagens")
        .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
};

module.exports = cursinhosTableController;
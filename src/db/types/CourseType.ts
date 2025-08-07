import { MulterFile } from "../../../utils/uploadPhoto"
import express from "express"

export type CreateCourseType = {
    id_endereco: string
    id_cinfo: string
    nome: string
    nome_exibido: string
    cnpj: string
    representante_legal: string
    email_contato: string
    telefone: string
    site: string
}

export type CreateCourseAddressType = {
    rua: string
    numero: string
    bairro: string
    cidade: string
    cep: string
    estado: string
    uf: string
    regiao: string
}

export type CreateCourseInfoType = {
    modalidades: string[]
    disciplinas_foco: string[]
    media_alunos: string
    diferenciais: string
    faixa_preco: string
    tem_bolsa: boolean
    aceita_programas_publico: boolean
    descricao: string
    logo: Express.Multer.File | string
    imagens_espaco: MulterFile[] | string[]
}
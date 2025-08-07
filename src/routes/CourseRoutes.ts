import express, { NextFunction, Request, Response } from "express"
import { CourseService } from "../services/CourseService"
import { CourseRepository } from "../repositories/CourseRepository"
import { CourseInfoRepository } from "../repositories/CourseInfoRepository"
import { CourseAddressRepository } from "../repositories/CourseAddressRepository"
import upload from "../config/multer"
import { CreateCourseAddressType, CreateCourseInfoType, CreateCourseType } from "../db/types/CourseType"
import adminAuth from "../middleware/adminAuth"

const router = express.Router()
const service = new CourseService(new CourseRepository(), new CourseInfoRepository(), new CourseAddressRepository())

router.post("/course", upload.fields([{ name: "imagens", maxCount: 5 }, { name: 'logo', maxCount: 1 }]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = JSON.parse(req.body.data);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const { instituicao, endereco, academico, financeiro, imagens, login } = data;

        const logo = files["logo"][0]
        const imgs = files['imagens']

        const course: CreateCourseType = {
            id_endereco: "",
            id_cinfo: "",
            nome: instituicao.nome,
            nome_exibido: instituicao.nomeExibido,
            cnpj: instituicao.cnpj,
            representante_legal: instituicao.representanteLegal,
            email_contato: instituicao.emailContato,
            telefone: instituicao.telefone,
            site: instituicao.site,
        };

        const address: CreateCourseAddressType = {
            rua: endereco.rua,
            numero: endereco.numero,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            cep: endereco.cep,
            estado: endereco.estado,
            uf: endereco.uf,
            regiao: endereco.regiao,
        };

        const courseInfo: CreateCourseInfoType = {
            modalidades: academico.modalidades,
            disciplinas_foco: academico.disciplinasFoco,
            media_alunos: academico.mediaAlunosPorTurma,
            diferenciais: academico.diferenciais,
            faixa_preco: financeiro.faixaPreco,
            tem_bolsa: financeiro.temBolsa,
            aceita_programas_publico: financeiro.aceitaProgramasPublicos,
            descricao: imagens.descricao,
            logo: logo,
            imagens_espaco: imgs,
        };

        const response = await service.insertCursinho(course, courseInfo, address)

        return res.status(201).json({
            message: response
        })

    } catch (err) {
        next(err)
    }
})

router.get("/admin/course/approve", adminAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course_approve = await service.selectAdminCourse()

        return res.status(200).json({
            data: course_approve
        })
    } catch (err) {
        next(err)
    }

})

router.patch("/admin/course/:id_course/approve", adminAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_course = req.params.id_course

        await service.approveCourse(id_course)

        return res.sendStatus(204)
    } catch (err) {
        throw err
    }

})
export default router
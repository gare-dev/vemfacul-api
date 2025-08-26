import { CreateCourseAddressType, CreateCourseInfoType, CreateCourseType } from "../db/types/CourseType";
import { CourseAddressRepository } from "../repositories/CourseAddressRepository";
import { CourseInfoRepository } from "../repositories/CourseInfoRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import uploadCoursePhoto from "../../utils/uploadCoursePhoto"
import { MulterFile } from "../../utils/uploadPhoto";
import { CustomError } from "../errors/HttpError";

export class CourseService {
    constructor(
        private course_repo: CourseRepository,
        private course_info_repo: CourseInfoRepository,
        private course_address_repo: CourseAddressRepository
    ) { }

    async insertCursinho(course_basic: CreateCourseType, course_info: CreateCourseInfoType, course_address: CreateCourseAddressType) {

        const [id_endereco, id_cinfo] = await Promise.all([
            this.insertAddress(course_address),
            this.insertInfo(course_info, course_basic.nome_exibido)
        ])

        return await this.insertCourse({ ...course_basic, id_endereco: id_endereco, id_cinfo: id_cinfo })
    }

    async insertAddress(course_address: CreateCourseAddressType) {
        const address = await this.course_address_repo.insertCourseAddress(course_address)

        if (address.rowCount && address.rowCount >= 1) {
            return address.rows[0].id_endereco
        }
    }

    async insertInfo(course_info: CreateCourseInfoType, nomeExibido: string) {
        let images_url = []
        let logo_url = null

        images_url = await Promise.all(course_info.imagens_espaco?.map(async (file) => {
            return uploadCoursePhoto(file as MulterFile, nomeExibido)
        }))
        logo_url = await uploadCoursePhoto(course_info.logo as unknown as MulterFile, nomeExibido)

        const info = await this.course_info_repo.insertCourseInfo({ ...course_info, imagens_espaco: images_url, logo: logo_url })

        if (info.rowCount && info.rowCount >= 1) {
            return info.rows[0].id_cinfo
        }
    }

    async insertCourse(course_basic: CreateCourseType) {
        const course = await this.course_repo.insertCourse(course_basic)

        if (course.rowCount && course.rowCount >= 1) {
            return true
        }
    }

    async selectAdminCourse() {
        const admin_course = await this.course_repo.selectAdminCourse()

        if (admin_course.rowCount && admin_course.rowCount === 0) throw new CustomError("Nenhum cursinho para ser aprovado foi encontrado.", 400, "EMPTY_APPROVECOURSE")

        return admin_course.rows
    }

    async approveCourse(id_course: string) {
        if (!id_course) throw new CustomError("ID Course é necessário para aprovar um cursinho.", 400, "IDCOURSE_MISSING")

        const approved_course = await this.course_repo.approveCourse(id_course)

        if (approved_course.rowCount === 0) {
            throw new CustomError("Cursinho não encontrado.", 400, "NOTFOUND_COURSE")
        }

        return approved_course
    }
}
export type CreateUserType = {
    password: string
    email: string
}

export type UpdateUserPhotoType = {
    imageURL: string
    email: string
}

export type RegisterUserType = {
    nome?: string;
    estado?: "SP" | "RJ" | "MG" | "ES" | "BA" | "SE" | "AL" | "PE" | "PB" | "RN" | "CE" | "PI" | "MA" | "PA" | "AP" | "TO" | "MT" | "MS" | "GO" | "DF" | "RO" | "AC" | "AM" | "RR" | "";
    nivel?: "Aluno EM" | "Universitário" | "Vestibulando" | "Professor" | "";
    escola?: string;
    ano?: string
    vestibulares?: any;
    passouVestibular?: any;
    universidade?: string;
    curso?: string;
    formouEM?: any;
    trabalha: any
    instituicao?: string;
    email: string
    materiasLecionadas: any

}
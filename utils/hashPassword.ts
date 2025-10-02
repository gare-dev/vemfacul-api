import bcrypt from "bcrypt"

export default async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
}
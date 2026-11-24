import bcrypt from "bcrypt"
import { password } from "bun"

export const hashPassword = async(password : string) => {
    return await bcrypt.hash(password ,10)
}

export const checkPassword = async(password : string , hasedPassword : string) => {
    return await bcrypt.compare(password , hasedPassword)
}
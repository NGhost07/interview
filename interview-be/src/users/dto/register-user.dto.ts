import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    full_name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsEnum(Role)
    @IsOptional()
    role?: Role
}
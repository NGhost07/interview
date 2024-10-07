import { Role } from "@prisma/client"
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class QueryUserDto {
    @IsOptional()
    @IsNumber()
    skip?: number

    @IsOptional()
    @IsNumber()
    take?: number

    @IsOptional()
    @IsString()
    orderBy?: string

    @IsOptional()
    @IsString()
    cursorId?: string

    @IsOptional()
    @IsString()
    full_name?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsBoolean()
    premium_account?: boolean

    @IsOptional()
    @IsString()
    nationality?: string

    @IsOptional()
    @IsBoolean()
    is_active?: boolean

    @IsOptional()
    @IsString()
    language?: string
}
import { IsEmail, IsOptional, IsString } from "class-validator"

export class UpdateProfileDto{
    @IsOptional()
    @IsString()
    full_name?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    avata?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    nationality?: string

    @IsOptional()
    @IsString()
    language?: string
}
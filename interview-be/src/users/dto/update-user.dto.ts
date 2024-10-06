import { IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    full_name?: string

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
    language: string
}
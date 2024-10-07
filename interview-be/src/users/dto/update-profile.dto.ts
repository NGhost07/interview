import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString } from "class-validator"

export class UpdateProfileDto{
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    full_name?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    password?: string

    @ApiProperty({ 
        required: false,
        description: 'avata url'
    })
    @IsOptional()
    @IsString()
    avata?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    nationality?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    language?: string
}
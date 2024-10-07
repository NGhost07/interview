import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    full_name: string

    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        example: 'MEMBER',
        enum: Role,
        default: 'MEMBER',
        required: false
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role
}
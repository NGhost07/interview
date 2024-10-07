import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

export class QueryUserDto {
    @ApiProperty({ 
        required: false,
        default: 0,
        description: 'number of records you want to skip'
    })
    @IsOptional()
    @IsNumber()
    skip?: number

    @ApiProperty({ 
        required: false,
        default: 10,
        description: 'Number of records you want to take'
    })
    @IsOptional()
    @IsNumber()
    take?: number

    @ApiProperty({ 
        required: false, 
        example: 'createAt:asc'
    })
    @IsOptional()
    @IsString()
    orderBy?: string

    @ApiProperty({ 
        required: false,
        description: 'the id of the record user you want to start with'
    })
    @IsOptional()
    @IsUUID()
    cursorId?: string

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
    phone?: string

    @ApiProperty({ 
        required: false,
        example: 'MEMBER'
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    premium_account?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    nationality?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    language?: string
}
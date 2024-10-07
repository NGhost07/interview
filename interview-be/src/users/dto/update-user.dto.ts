import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsBoolean, IsEnum, IsOptional } from "class-validator"

export class UpdateUserDto {
    @ApiProperty({ 
        required: false,
        example: 'MEMBER'
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    premium_account?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean
}
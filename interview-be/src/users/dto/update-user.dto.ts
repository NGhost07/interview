import { Role } from "@prisma/client"
import { IsBoolean, IsEnum, IsOptional } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsBoolean()
    premium_account?: boolean

    @IsOptional()
    @IsBoolean()
    is_active?: boolean
}
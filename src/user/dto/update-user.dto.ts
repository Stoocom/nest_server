import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Validate } from 'class-validator';
import { Role } from '../../role/entities/role.entity';
import CapitalLetterValidator from '../validate/CapitalLetterValidator';
import IncludeNumberValidator from '../validate/IncludeNumberValidator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    login?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @Validate(CapitalLetterValidator)
    @Validate(IncludeNumberValidator)
    password?: string;

    @IsOptional()
    updateRoles?: string[];
}

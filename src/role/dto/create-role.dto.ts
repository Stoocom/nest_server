import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreateRoleDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    user_id?: number;
}

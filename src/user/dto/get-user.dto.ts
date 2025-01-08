import { IsString } from "class-validator";


export class GetUserDto {
    @IsString()
    login: string;
}

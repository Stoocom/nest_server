import { IsOptional, IsString, Validate } from "class-validator";
import CapitalLetterValidator from "../validate/CapitalLetterValidator";
import IncludeNumberValidator from "../validate/IncludeNumberValidator";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsString()
    name: string;

    @IsString()
    @Validate(CapitalLetterValidator)
    @Validate(IncludeNumberValidator)
    password: string;

    @IsOptional()
    roles?: string[];
}

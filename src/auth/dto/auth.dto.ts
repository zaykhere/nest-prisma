import {IsEmail, MinLength} from "class-validator";

export class AuthDto {
    @IsEmail()
    email: string;

    @MinLength(6, {
        message: "Password is too short"
    })
    password: string;
}
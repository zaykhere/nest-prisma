import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async register(dto: AuthDto) {
        const {email, password} = dto;

        
        const hashedPassword = await argon.hash(password);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            })

            delete user.password;

            return user;
        } catch (error) {
            return error.message;
        }

        

        
    }

    login() {

    }
}
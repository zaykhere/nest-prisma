import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
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

            return this.signToken(user.id, user.email);

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException('This email is already taken');
                }
            }
            else {
                throw error;
            }
        }  
    }

    async login(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(!user) {
            throw new ForbiddenException("Invalid Credentials");
        }

        const passwordMatches = await argon.verify(user.password, dto.password);

        if(!passwordMatches) {
            throw new ForbiddenException("Invalid Credentials");
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        };

        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30d',
            secret: secret
        });

        return {
            access_token: token
        };
    }
}
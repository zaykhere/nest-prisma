import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }

    @Post('/login')
    login() {

    }
}

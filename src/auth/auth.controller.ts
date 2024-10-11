import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('singup')
    async singup(@Body() singupData: SingupDto) {
        return await this.authService.singup(singupData);
        
    }

    @Post('login')
    async login(@Body() credentials: LoginDto) {
        return await this.authService.login(credentials);
        
    }
    
}

import { Body, Controller, Get, Post, Request, Response, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    signIn(@Body() signInDto: Record<string, any>, @Response({passthrough: true}) res) {
        res.cookie('accessToken', access)
        const userData = this.authService.signIn(signInDto.login, signInDto.password);
        return userData
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return req.logout();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('profile', req.user);
        return req.user;
    }

    // @Post('signIn')
    // signIn(@Body() signInDto: SignInDto) {
    //     console.log('signInDto', signInDto);
    //     return this.authService.signIn(signInDto);
    // }
}

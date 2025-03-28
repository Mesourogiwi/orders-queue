import {Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common'
import {AuthGuard} from './auth.guard'
import {AuthService} from './auth.service'
import {SignInDto} from './dto/signIn.dto'
import {Public} from './constants/constants'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}

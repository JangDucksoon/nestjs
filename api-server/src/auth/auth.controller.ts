import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	async singupUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.singupUser(createUserDto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: any) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	async refreshAccessToken(@Request() req: any) {
		return this.authService.refreshAccessToken(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('verifyToken')
	async verifyToken() {
		return { message: 'Token is valid' };
	}

}

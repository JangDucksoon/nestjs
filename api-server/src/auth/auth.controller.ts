import { Controller, Post, UseGuards, Request, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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

	@Post()
	async singupUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.singupUser(createUserDto);
	}

	@Get(':userId')
	async getUser(@Param("userId") userId: string) {
		return this.authService.getUser(userId);
	}

	@Post('checkPassword/:id')
	async checkPassword(@Param('id') id: string, @Body("password") password: string) {
        return this.authService.checkPassword(+id, password);
    }
}

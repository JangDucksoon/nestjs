import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	async login(@Request() req: any) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/refresh')
	async refreshAccessToken(@Request() req: any) {
		return this.authService.refreshAccessToken(req.user);
	}
}

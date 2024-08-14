import { Controller, Delete, Post, UseGuards, Request, Get, Body, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req: any) {
		return this.authService.login(req.user, (req.sessionID as string));
	}

	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	refreshAccessToken(@Request() req: any) {
		console.log('controller: req session ID: ', req.sessionID);
		return this.authService.refreshAccessToken(req.user, (req.sessionID as string));
	}

	@UseGuards(JwtAuthGuard)
	@Get('verifyToken')
	verifyToken() {
		return { message: 'Token is valid' };
	}

	@Post()
	singupUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.singupUser(createUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':userId')
	getUser(@Param("userId") userId: string) {
		return this.authService.getUser(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('checkPassword/:id')
	checkPassword(@Param('id') id: number, @Body("password") password: string) {
        return this.authService.checkPassword(id, password);
    }

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	updateUser(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.authService.updateUser(id, updateUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteUser(@Param("id") id: number) {
		return this.authService.deleteUser(id);
	}
}


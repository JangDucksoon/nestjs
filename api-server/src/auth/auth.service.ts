import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(Auth)
		private readonly userRepository: Repository<Auth>
	) { }

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userRepository.findOne({where: {username}});
		if (user && await bcrypt.compare(password, user.hashed_password)) {
			const { hashed_password,...result } = user;
            return result;
		}

		return null;
	}

	async login(user: any) {
		const payload = {username: user.username, sub: user.id, auth: user.auth};
		
		return {
            access_token: this.jwtService.sign(payload, { expiresIn: '60m' }),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
			test_token: this.jwtService.sign(payload, { expiresIn: '10s' })
        };
	}

	async refreshAccessToken(user: any) {
		const payload = {username: user.username, sub: user.sub, auth: user.auth};
        
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '60m' })
        };
	}

	decodeAccessToken(token: string) {
		if (!token) return null;

		return this.jwtService.decode(token);
	}
}

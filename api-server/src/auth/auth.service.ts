import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { Basket } from 'src/basket/entities/basket.entity';
import { Payment } from 'src/payment/entities/payment.entity';


@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(Auth)
		private readonly userRepository: Repository<Auth>
	) { }

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userRepository.findOne({where: {username}});
		if (user && await bcrypt.compare(password, user.hashedPassword)) {
			const { hashedPassword,...result } = user;
            return result;
		}

		return null;
	}

	login(user: any) {
		const payload = {username: user.username, sub: user.id, auth: user.auth};
		
		return {
            access_token: this.jwtService.sign(payload, { expiresIn: '60m' }),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '1d' })
        };
	}

	async singupUser(createuserDto: CreateUserDto){
		console.log('createuserDto', createuserDto);
		if (!createuserDto.username || !createuserDto.hashedPassword) {
			throw new BadRequestException('Please enter your username and password.');
		}

		const user = await this.userRepository.findOne({where: {username: createuserDto.username || ''}});

		if (user) {
			throw new ConflictException('Username already taken');
		}
		
		const result = await this.userRepository.insert(createuserDto);
		const newUser = await this.userRepository.findOne({
			where: {id: result.identifiers[0].id}
		});

		return this.login(newUser);
	}

	refreshAccessToken(user: any) {
		const payload = {username: user.username, sub: user.sub, auth: user.auth};
        
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '60m' })
        };
	}

	decodeAccessToken(token: string) {
		if (!token) return null;

		return this.jwtService.decode(token);
	}

	getUser(userId: string) {
		return this.userRepository.findOne({where:{username: userId}});
	}

	async checkPassword(id: number, password: string) {
		const user: Auth = await this.userRepository.findOne({where:{id}});

		if (user) {
			return bcrypt.compare(password, user.hashedPassword);
		} else {
			throw new NotFoundException('User not found');
		}
	}

	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		await this.userRepository.update(id, updateUserDto);
		const user2 = await this.userRepository.findOne({where:{id}});
		return this.login(user2);
	}
}

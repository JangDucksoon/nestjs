import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import * as bcrypt from "bcrypt";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => bcrypt.hashSync(value, 10))
    hashedPassword: string;
}
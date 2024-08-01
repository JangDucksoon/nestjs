import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    price: number;

    @IsString()
    @IsOptional()
    image_url: string;
}

import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateBasketDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    productId: number;

    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    productQuantity: number;

    @IsNotEmpty()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    totalPrice: number;
}

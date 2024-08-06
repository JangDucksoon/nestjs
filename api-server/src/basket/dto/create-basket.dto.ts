import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBasketDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsNotEmpty()
    @IsInt()
    productQuantity: number;

    @IsNotEmpty()
    @IsInt()
    totalPrice: number;
}

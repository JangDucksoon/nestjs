import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsObject, isObject, IsString, ValidateNested } from "class-validator";
import { CreateProductDto } from "src/product/dto/create-product.dto";

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

    @IsObject()
    @ValidateNested()
    @Type(() => CreateProductDto)
    product: CreateProductDto;
}

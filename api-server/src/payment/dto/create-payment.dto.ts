import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePaymentDto {

    @IsNotEmpty()
    @IsInt()
    @Transform(({value}) => parseInt(value))
    productId: number;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    @Transform(({value}) => parseInt(value))
    amount: number;
}

import type Product from "./Product";

export default interface Basket {
    [key: string]: any;
    userId: string;
    productId: number;
    productQuantity: number;
    totalPrice: number;
    product?: Product
}
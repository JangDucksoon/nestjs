import type Product from "./Product";

export default interface Payment {
    [key: string]: any;

    productId: number;

    userId: string;

    amount: number;

    product?: Product;
}
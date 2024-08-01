export default interface Product {
    [key: string]: any;
    id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string | null;
}
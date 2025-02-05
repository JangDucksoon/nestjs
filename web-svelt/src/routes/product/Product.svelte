<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import properties from "../../property/config";
    import { navigate } from "svelte-routing";
    import { progress, accessToken } from "../../store";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import Tooltip from "../../components/Tooltip/Tooltip.svelte";
    import { commonModule } from "../../module/commonModule";
    import type Product from "../../types/Product";
    import TextField from "../../components/TextField/TextField.svelte";
    import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
    import Icon from 'svelte-awesome';
    import messageModule from "../../module/swalConfig"
    import type Payment from "../../types/Payment";

    export let id: number;
    
    let product: Product | null = null;
    let error: string | null = null;
    let productQuantity: number|null = null;
    let authSystem: boolean = commonModule.checkAdministrator();

    const getProduct = async (id: number) => {
        commonModule.increaseProgress(1);
        try {
            const res = await axiosInstance.get<Product>(`product/${id}`);
            if (res.status === 200) {
                product = res.data;
            }
        } catch (error: any) {
            error = error.message;
        }
    }

    const moveModifyProduct = () => {
        commonModule.verifyToken(() => {
            navigate(`/product/${id}/modify`);
        });
    }

    const updateQuantity = (type: string) => {
        if (type === "plus") {
            productQuantity = (productQuantity || 0) + 1;
        } else if (type === "minus") {
            productQuantity = ((productQuantity || 0) - 1) < 0 ? 0 : ((productQuantity || 0) - 1);
        }
    }

    const addToCart = async () => {
        if ((productQuantity||0) <= 0) {
            messageModule.alert("Quantity must be greater than 0", null, 'info');
            return;
        }

        let userId: string = '';
        await commonModule.verifyToken(() => {
            userId = (commonModule.decodeJwtToken($accessToken) as any).username;
        });
        
        let {id: productId, price} = product!;
        const totalPrice = price * productQuantity!;

        if (!userId) {
            messageModule.alert("Please login to add product to cart", null, 'info');
            return;
        }

        if (isNaN(totalPrice) || totalPrice <= 0) {
            messageModule.alert("Invalid price or quantity", null, 'info');
            return;
        }

        const basket = {userId, productId, productQuantity, totalPrice };
        const res = await axiosInstance.post<Record<string, any>>("/basket", basket);

        if (res?.status === 201) {
            messageModule.alert("Product added to cart successfully", () => productQuantity = null);
        }
    }

    const purchaseNow = () => {
        if ((productQuantity||0) <= 0) {
            messageModule.alert("Quantity must be greater than 0", null, 'info');
            return;
        }

        messageModule.confirm("Are you sure to purchase this product?", async (result: boolean) => {
            if (!result) return;
            
            let userId: string = '';
            await commonModule.verifyToken(() => {
                userId = (commonModule.decodeJwtToken($accessToken) as any).username;
            });

            if (!userId) {
                messageModule.alert("Please login to purchase this product", null, 'info');
                return;
            }

            const paymentList: Payment[] = [];
            Array.from({length: productQuantity!}).forEach(_ => {
                const payment: Payment = {
                    userId,
                    productId: product!.id,
                    amount: product!.price,
                }

                paymentList.push(payment);
            });

            const res = await axiosInstance.post<boolean>("/payment/now", paymentList);

            if (res?.status === 201) {
                messageModule.alert("Purchase completed successfully", () => {
                    productQuantity = null;
                });
            }
        });
    }

    const showTotalPrice = () => {
        const price:number | undefined = product?.price;
        const quantity: number = productQuantity!;
        const result = (price as number * quantity);

        return isNaN(result) ? '0 \\': result.toLocaleString() + ' \\';
    }

    $: {
        $accessToken
        authSystem = commonModule.checkAdministrator();
    }

    onMount(() => getProduct(id));
    onDestroy(() => commonModule.destroyProgress());
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
    {#if $progress !== 0}
        <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
        <ProgressLinear app={true} color="yellow" progress={$progress}/>
    {:else if error}
        <p class="text-center text-red-500">{error}</p>
    {:else if product}
        <div id="{`product-${id}`}" class="container mx-auto px-4 py-8 flex flex-col items-center">
            <h1 class="text-3xl font-bold mb-6 text-center">{`NO.${product?.id} ${product?.name}`}</h1>
            <div class="mt-4 md:mt-0 md:ml-8 text-center">
                <p class="text-xl mb-4">{product?.description}</p>
                <p class="text-2xl font-bold text-blue-600">{product?.price?.toLocaleString()} 원</p>
            </div>
            <img src={`${properties.API_SERVER}/${product?.image_url}`} alt="" class="image"/>
        </div>
        <div class="flex space-x-4">
            <TextField type="number" label="Quantity" outlined hint="Quantity of items to order" readonly bind:value={productQuantity} on:input={commonModule.filterHangleAndSpace}/>
            <div class="flex flex-col h-14 mt-2 gap-1">
                <button type="button" class="text-blue hover:text-gray-300 flex items-center border border-gray-300 rounded-lg shadow-sm hover:shadow-md" on:click={() => updateQuantity('plus')}>
                    <Icon data={faPlus} scale={1.5}/>
                    <span class="sr-only">+</span>
                </button>
                <button type="button" class="text-blue hover:text-gray-300 flex items-center border border-gray-300 rounded-lg shadow-sm hover:shadow-md" on:click={() => updateQuantity('minus')}>
                    <Icon data={faMinus} scale={1.5}/>
                    <span class="sr-only">-</span>
                </button>
            </div>
            <Tooltip>
                <div slot="activator">
                    <button type="button" class="btn-blue mt-2 h-14 disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" on:click={addToCart} disabled={(productQuantity||0) <= 0}>Add to Cart</button>
                </div>
                {showTotalPrice()}
            </Tooltip>
            <Tooltip>
                <div slot="activator">
                    <button type="button" class="btn-pink mt-2 h-14 disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" on:click={purchaseNow} disabled={(productQuantity||0) <= 0}>Purchase Now</button>
                </div>
                {showTotalPrice()}
            </Tooltip>
        </div>
        <div class="flex space-x-4 mt-4">
            <button type="button" class="btn" on:click={() => navigate('/product')}>List</button>
            {#if authSystem}
                <button type="button" class="btn-blue" on:click={moveModifyProduct}>Modify</button>
            {/if}
        </div>
    {:else}
        <p class="text-center text-red-500">Product doesn't exist</p>
    {/if}
</div>

<style lang="postcss">
    .image {
        @apply w-1/4 object-contain rounded-lg shadow-lg border border-gray-300 mt-8 mb-4;
    }
</style>
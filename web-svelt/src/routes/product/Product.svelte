<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import properties from "../../property/config";
    import { navigate } from "svelte-routing";
    import { progress, accessToken } from "../../store";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { commonModule } from "../../module/commonModule";
    import type Product from "../../types/Product";

    export let id: number;
    
    let product: Product | null = null;
    let error: string | null = null;

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
            <img src={`${properties.API_SERVER}/${product?.image_url}`} alt={product?.name} class="image"/>
        </div>
        <div class="flex space-x-4 mt-4">
            <button type="button" class="btn" on:click={() => navigate('/product')}>List</button>
            {#if commonModule.checkAdministrator()}
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
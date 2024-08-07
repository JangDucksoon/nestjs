<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { progress, accessToken } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import { axiosInstance } from "../../module/axiosConfig";
    import type Basket from "../../types/Basket";
    import { navigate, Link } from "svelte-routing";
    import properties from "../../property/config";
    import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
    import Icon from 'svelte-awesome';
    import messageModule from "../../module/swalConfig";

    let basketList: Basket[] = [];

    const getBasketList = async () => {
        commonModule.increaseProgress(0.1);
        const userId: string = (commonModule.decodeJwtToken($accessToken) as any).username;
        const res = await axiosInstance.get<Basket[]>(`basket/${userId}`);

        if (res?.status === 200) {
            basketList = res.data;
        }
    }

    const deleteBasket = async (basket: Basket) => {
        const userId: string = basket.userId;
        const productId: number = basket.productId;

        const res = await axiosInstance.delete<Basket[]>(`basket/${userId}/${productId}`);
        if (res?.status === 200) {
            refreshBasketList(res.data);
        } else {
            messageModule.error('Error deleting item from the cart', getBasketList);
        }
    }

    const updateBasket = async (basket: Basket) => {
        const {userId, productId, product, ...updateProperties} = basket;
        const res = await axiosInstance.patch<Basket>(`basket/${userId}/${productId}`, updateProperties);
            
        if (res?.status === 200) {
            refreshBasketList(res.data);
        } else {
            messageModule.error('Error updating item quantity in the cart', getBasketList);
        }
    }

    const changeCartProperties = (basket: Basket, type: string) => {
        if (type === 'plus') {
            basket.productQuantity += 1;
        } else {
            basket.productQuantity -= 1;
        }

        if (basket.productQuantity <= 0) {
            deleteBasket(basket);
        } else {
            basket.totalPrice = basket.productQuantity * (basket.product?.price||0);
            updateBasket(basket);
        }
    }

    const refreshBasketList = (result:Basket[]|Basket) => {
        commonModule.increaseProgress(10, 'server');

        if (Array.isArray(result)) {
            basketList = result;
        } else {
            basketList = basketList.map(b => {
                if (b.productId === result.productId) {
                    return result;
                }
                return b;
            })
        }
    }

    const activeCard = (zoom: boolean, productId: number) => {
        const card = document.getElementById(`product-${productId}`);
        if (zoom) {
            card?.classList.add('active');
        } else {
            card?.classList.remove('active');
        }
    }

    $: if (!$accessToken) {
        navigate('/product');
    }
    onMount(getBasketList);
    onDestroy(() => commonModule.destroyProgress());
</script>

{#if $progress}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="pink" progress={$progress}/>
{:else if basketList.length === 0}
    <p class="text-center font-bold text-red-900">There are no items in your cart.</p>
{:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each basketList as basket (basket.productId)}
        <div id="{`product-${basket.productId}`}" class="product-item bg-white rounded-lg shadow-md overflow-hidden" title={basket.product?.name} class:active={false}>
            <img src={properties.API_SERVER + '/' + basket.product?.image_url} alt="" class="w-full h-48 object-contain" 
            on:mouseenter={() => activeCard(true, +basket.productId)} 
            on:mouseleave={() => activeCard(false, +basket.productId)}/>
            <div class="p-4">
                <Link to={`/product/${basket.productId}`} class="text-xl font-semibold mb-2 hover:underline hover:cursor-pointer">{basket.product?.name}</Link>
                <p class="text-gray-600 mb-2">{basket.product?.description}</p>
                <p class="text-lg font-bold text-blue-600">{basket.totalPrice.toLocaleString()} 원</p>
            </div>
            <div class="flex items-center justify-center gap-1 mb-3 space-x-4">
                <button type="button" class="text-blue hover:text-gray-300 flex items-center border border-gray-300 shadow-sm hover:shadow-md" on:click={() => changeCartProperties(basket, 'minus')}>
                    <Icon data={faMinus} scale={1.5}/>
                    <span class="sr-only">-</span>
                </button>
                <input type="text" readonly class="w-16 text-center" bind:value={basket.productQuantity} />
                <button type="button" class="text-blue hover:text-gray-300 flex items-center border border-gray-300 shadow-sm hover:shadow-md" on:click={() => changeCartProperties(basket, 'plus')}>
                    <Icon data={faPlus} scale={1.5}/>
                    <span class="sr-only">+</span>
                </button>
            </div>
        </div>
        {/each}
    </div>
{/if}

<style>
    .product-item {
        transition: transform 0.3s ease-in-out;
        height: 400px; /* 고정된 높이 설정 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .product-item a {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 두 줄까지만 표시 */
        -webkit-box-orient: vertical;
        line-clamp: 2; /* 표준 속성으로 호환성을 높임 */
        box-orient: vertical; /* 표준 속성으로 호환성을 높임 */
    }

    .product-item p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; /* 두 줄까지만 표시 */
        -webkit-box-orient: vertical;
        line-clamp: 1; /* 표준 속성으로 호환성을 높임 */
        box-orient: vertical; /* 표준 속성으로 호환성을 높임 */
    }

    .product-item.active {
        transform: scale(1.1);
        cursor: pointer; 
    }
</style>
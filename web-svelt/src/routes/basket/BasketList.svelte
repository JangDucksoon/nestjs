<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { progress, accessToken } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import { axiosInstance } from "../../module/axiosConfig";
    import type Basket from "../../types/Basket";
    import { navigate } from "svelte-routing";
    import properties from "../../property/config";
    import { faPlus, faMinus, faX, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
    import Icon from 'svelte-awesome';
    import messageModule from "../../module/swalConfig";

    let basketList: Basket[] = [];
    let checkedList: number[] = [];
    let totalPrice: number = 0;
    let checkedPrice: number = 0;

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
        }
    }

    const deleteCheckedBaskets = (all: boolean = false) => {
        if (!all && checkedList.length === 0) {
            messageModule.alert('No items selected for deletion', null, 'info');
            return;
        }
        
        messageModule.confirm('Are you sure you want to delete these items?', async (result: boolean) => {
            if (!result) return;

            const userId: string = (commonModule.decodeJwtToken($accessToken) as any).username;
            const productIdArray: string = all ? basketList.map(b => b.productId).join(',') : checkedList.join(',');
            const res = await axiosInstance.delete<Basket[]>(`basket/${userId}/checked?productIdArray=${productIdArray}`);

            if (res?.status === 200) {
                refreshBasketList(res.data);
                checkedList = [];
            }
        });
        
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

    const checkCard = (productId: number) => {
        const card = document.getElementById(`product-check-${productId}`);

        if (card) {
            if (card.classList.contains('hidden')) {    //hidden 이 remove되면 체크
                card.classList.remove('hidden');
                checkedList = [...checkedList, productId];   
            } else {    //체크해제
                card.classList.add('hidden');
                checkedList = checkedList.filter(id => id!== productId);
            }
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


    $: $accessToken ? void(0) : navigate('/product');
    $: totalPrice = basketList.reduce((acc, curr) => acc + curr.totalPrice, 0);
    $: checkedPrice = basketList.filter(b => checkedList.includes(b.productId)).reduce((acc, curr) => acc + curr.totalPrice, 0);

    onMount(getBasketList);
    onDestroy(() => commonModule.destroyProgress());
</script>

<div class="container mx-auto px-4 py-8">
    <!--<button type="button" class="btn-green" on:click={() => deleteCheckedBaskets()}>Delete Selected</button>-->
    {#if $progress}
        <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
        <ProgressLinear app={true} color="pink" progress={$progress}/>
    {:else if basketList.length === 0}
        <p class="text-center font-bold text-red-900">There are no items in your cart.</p>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {#each basketList as basket (basket.productId)}
                <div id="{`product-${basket.productId}`}" class="product-item bg-white rounded-lg shadow-md overflow-hidden" title={basket.product?.name} class:active={false}>
                    <div id={`product-check-${basket.productId}`} class="cardOverlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 ease-in-out z-20 flex items-center justify-center hidden">
                        <button type="button" class="transition duration-300 transform flex items-center shadow-sm hover:shadow-xl hover:scale-110" on:click={() => checkCard(basket.productId)}>
                            <Icon data={faCircleCheck} scale={5} style="color: #9c33c1;"/>
                        </button>
                    </div>
                    <button type="button" on:click={() => checkCard(basket.productId)} on:mouseenter={() => activeCard(true, +basket.productId)}  on:mouseleave={() => activeCard(false, +basket.productId)}>
                        <img src={properties.API_SERVER + '/' + basket.product?.image_url} alt="" class="w-full h-48 object-contain"/>
                    </button>
                    <div class="p-4">
                        <a href={`/product/${basket.productId}`} class="text-xl font-semibold mb-2 hover:underline hover:cursor-pointer">{basket.product?.name}</a>
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
                    <div class="absolute bottom-2 right-2">
                        <button type="button" class="text-blue hover:text-gray-300 flex items-center shadow-sm hover:shadow-md p-1 bg-white rounded" on:click={() => deleteBasket(basket)}>
                            <Icon data={faX} scale={1.5} style="color: #ff0000;"/>
                            <span class="sr-only">delete</span>
                        </button>
                    </div>
                </div>
            {/each}
        </div>
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
            <div class="container mx-auto">
                <div class="max-w-[1400px] mx-auto flex justify-between items-center"> <!-- max-w-[1280px]는 Tailwind의 기본 컨테이너 최대 너비 -->
                    <div class="text-lg font-semibold text-blue-500">
                        Total Amount : {totalPrice.toLocaleString()} 원 <br>
                        Selected Items Total : {checkedPrice.toLocaleString()} 원
                    </div>
                    <div class="flex gap-5 items-center mt-3">
                        <button class="btn-pink disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100" disabled={checkedList.length === 0}
                        on:click={() => deleteCheckedBaskets(false)}>Remove Selected</button>
                        <button class="btn-red" on:click={() => {deleteCheckedBaskets(true)}}>Remove All</button>
                        <button class="btn-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100" disabled={checkedList.length === 0}>Proceed with Selected Items</button>
                        <button class="btn-green">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .product-item {
        transition: transform 0.3s ease-in-out;
        position: relative;
        height: 400px; /* 고정된 높이 설정 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .product-item a {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; /* 두 줄까지만 표시 */
        -webkit-box-orient: vertical;
        line-clamp: 1; /* 표준 속성으로 호환성을 높임 */
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

    .product-item .cardOverlay {
        opacity: 1;
    }
</style>
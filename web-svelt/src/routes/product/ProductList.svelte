<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type Product from '../../types/Product';
    import properties from '../../property/config'
    import {axiosInstance} from '../../module/axiosConfig';
    import { Link, navigate } from 'svelte-routing';
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { accessToken, progress } from '../../store';
    import { commonModule } from '../../module/commonModule';
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
    import Icon from 'svelte-awesome';
    import Pagination from "../../components/Pagination/Pagination.svelte";


    let products: Product[] = [];
    let totalCount: number = 0;
    let error: string | null = null;
    let pageIndex: number = 0;
    let startIndex: number = 0;
    let authSystem: boolean = commonModule.checkAdministrator();
    let isFocused: boolean = false;
    let searchText = '';

    const recordPerPage: number = 16;

    async function getProductList(cPageIndex = 0) {
        commonModule.increaseProgress(10);

        const skip = cPageIndex * recordPerPage;
        const limit = recordPerPage;

        try {
            const res = await axiosInstance.get<[Product[], number]>(`/product?skip=${skip}&limit=${limit}&search=${searchText}`);

            if (res.status === 200) {
                [products, totalCount] = res.data;
            }
        } catch (error: any) {
            error = error.message;
        }
    }

    const pressEnter = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            startIndex = 0;
            pageIndex = 0;
            getProductList();
        }
    }

    $: {
        $accessToken
        authSystem = commonModule.checkAdministrator();
    }
    
    onMount(() => getProductList());
    onDestroy(() => {
        commonModule.destroyProgress();
    })
</script>

<div class="container mx-auto px-4 py-8">
    {#if authSystem}
        <button type="button" class="btn-green" on:click={() => navigate('/product/register')}>Registry</button>
    {/if}
    {#if $progress !== 0}
        <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
        <ProgressLinear app={true} color="yellow" progress={$progress}/>
    {:else if error}
        <p class="text-center text-red-500">{error}</p>
    {:else}
        <div class="mb-6">
            <div class="relative max-w-md mx-auto">
            <div class="relative">
                <input
                type="text"
                placeholder="Search by product name or description"
                bind:value={searchText}
                on:focus={() => isFocused = true}
                on:blur={() => isFocused = false}
                on:keydown={pressEnter}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon data={faMagnifyingGlass} scale={1.0} class="mr-2 transition-all duration-300" color={`${isFocused ? '#3b82f6':'#d1d5db'}`}/>
                </div>
            </div>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {#each products as product (product.id)}
            <Link to={`/product/${product.id}`} class="block">
            <div id="{`product-${product.id}`}" class="product-item bg-white rounded-lg shadow-md overflow-hidden" title={product.name}>
                <img src={properties.API_SERVER + '/' + product.image_url} alt="" class="w-full h-48 object-contain" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{product.name}</h2>
                    <p class="text-gray-600 mb-2">{product.description}</p>
                    <p class="text-lg font-bold text-blue-600">{product.price.toLocaleString()} 원</p>
                </div>
            </div>
            </Link>
            {/each}
        </div>
        <Pagination totalCount={totalCount} bind:pageIndex={pageIndex} bind:startIndex={startIndex} recordPerPage={recordPerPage} selectFunc={getProductList} pageSize={5}/>
    {/if}
</div>

<style>
    .product-item {
        transition: transform 0.3s ease-in-out;
        height: 350px; /* 고정된 높이 설정 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .product-item h2 {
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

    .product-item:hover {
        transform: scale(1.1); /* 요소가 5% 커지면서 튀어나오는 효과 */
        cursor: pointer;
    }
</style>
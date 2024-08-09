<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { progress } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import { axiosInstance } from "../../module/axiosConfig";
    import { accessToken } from "../../store";
    import type UserPayment from "../../types/UserPayment";
    import properties from "../../property/config";
    import Pagination from "../../components/Pagination/Pagination.svelte";
    import { navigate } from "svelte-routing";

    let PaymentList: UserPayment[] = [];
    let recordPerPage = 20;
    let pageIndex = 0;
    let startIndex = 0;
    let totalCount = 0;

    const getPaymentList = async (cPageIndex = 0) => {
        commonModule.increaseProgress();

        const skip = cPageIndex * recordPerPage;
        const userId = (commonModule.decodeJwtToken($accessToken) as any).username;
        const res = await axiosInstance.get<{list: UserPayment[], count: number}>(`/payment/${userId}?limit=${recordPerPage}&skip=${skip}`);

        if (res?.status === 200) {
            PaymentList = res.data.list;
            totalCount = res.data.count;
        }
    };

    $: if (!$accessToken) {
        navigate('/product')
    }

    onMount(getPaymentList);
    onDestroy(commonModule.destroyProgress);
</script>

<div class="container mx-auto px-4 py-8">
    {#if $progress}
        <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
        <ProgressLinear app={true} color="green" progress={$progress} />
    {:else}
        <h1 class="text-2xl font-bold mb-4">Payment List</h1>
        <div class="container mx-auto p-4 cursor-default">
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-2 px-4 border-b text-center">No</th>
                            <th class="py-2 px-4 border-b text-center">썸네일</th>
                            <th class="py-2 px-4 border-b text-center">품명</th>
                            <th class="py-2 px-4 border-b text-right">가격</th>
                            <th class="py-2 px-4 border-b text-right">수량</th>
                            <th class="py-2 px-4 border-b text-center">결제일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each PaymentList as item, index (index)}
                            <tr class="hover:bg-gray-50">
                                <td class="text-center border-b">{index + 1}</td>
                                <td class="py-2 px-4 border-b">
                                    <img src={`${properties.API_SERVER}/${item.imageUrl}`} alt={item.name} class="w-16 h-16 object-cover"/>
                                </td>
                                <td class="py-2 px-4 border-b"><a href={`/product/${item.productId}`} class="font-bold hover:underline">{item.name}</a>
                                <td class="py-2 px-4 border-b text-right"><span class="font-bold text-blue-500">{item.totalPrice.toLocaleString()}</span> 원</td>
                                <td class="py-2 px-4 border-b text-right"><span class="font-bold">{item.pCnt}</span> 개</td>
                                <td class="py-2 px-4 border-b text-center">{item.payDate}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <Pagination totalCount={totalCount} bind:pageIndex={pageIndex} bind:startIndex={startIndex} recordPerPage={recordPerPage} selectFunc={getPaymentList} pageSize={5}/>
            </div>
        </div>
    {/if}
</div>

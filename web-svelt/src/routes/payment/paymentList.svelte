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
    import { faSortDown, faSortUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import Icon from 'svelte-awesome';
    import PaymentModal from "./paymentModal.svelte";
    

    let PaymentList: UserPayment[] = [];
    let recordPerPage: number = 20;
    let pageIndex: number = 0;
    let startIndex: number = 0;
    let totalCount: number = 0;
    let searchText: string = '';
    let isFocused: boolean = false;
    let orderCondition: any = {
        payDate: 'DESC',
        totalPrice: '',
        name: '',
        priority: 'payDate'
    };

    /*popup props*/
    let popProductId: number;
    let popPayDate: string;
    let show: boolean = false;
    let popUserId: string;

    const getPaymentList = async (cPageIndex = 0) => {
        commonModule.increaseProgress();

        const skip = cPageIndex * recordPerPage;
        const userId = (commonModule.decodeJwtToken($accessToken) as any).username;
        const res = await axiosInstance.get<{list: UserPayment[], count: number}>(`/payment/${userId}?limit=${recordPerPage}&skip=${skip}&search=${searchText}`, {params: orderCondition});

        if (res?.status === 200) {
            PaymentList = res.data.list;
            totalCount = res.data.count;
        }
    }

    const openReturnPop = (productId: number, payDate: string) => {
        popUserId = (commonModule.decodeJwtToken($accessToken) as any).username;
        popProductId = productId;
        popPayDate = payDate;
        show = true;
    }

    const oderbyHandler = (type: 'payDate'| 'totalPrice'| 'name') => {
        const condition = orderCondition[type] === 'DESC' ? 'ASC' : 'DESC';
        orderCondition = {};
        orderCondition[type] = condition;
        orderCondition = {...orderCondition, priority: type};
        getPaymentList();
    }

    const pressEnter = (evt: KeyboardEvent) => {
        if (evt.key === 'Enter') {
            pageIndex = 0;
            startIndex = 0;
            getPaymentList();
        }
    }

    $: if (!$accessToken) {
        navigate('/product');
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
        <div class="mb-6">
            <div class="relative max-w-md mx-auto">
            <div class="relative">
                <input
                type="text"
                placeholder="Search by product name"
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
        <div class="container mx-auto p-4 cursor-default">
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-2 px-4 border-b text-center">No</th>
                            <th class="py-2 px-4 border-b text-center"></th>
                            <th class="py-2 px-4 border-b text-center cursor-pointer">
                                <div role="button" on:click={() => oderbyHandler('name')} on:keydown={() => {}} tabindex="0">
                                    <span>Name</span>
                                    {#if orderCondition.name === 'DESC'}
                                        <Icon data={faSortDown} scale={1.5} class="ml-2 mb-2"/>
                                    {:else if orderCondition.name === 'ASC'}
                                        <Icon data={faSortUp} scale={1.5} class="ml-2 mt-2"/>
                                    {/if}
                                </div>
                            </th>
                            <th class="py-2 px-4 border-b text-right cursor-pointer">
                                <div role="button" on:click={() => oderbyHandler('totalPrice')} on:keydown={() => {}} tabindex="0">
                                    <span>Price</span>
                                    {#if orderCondition.totalPrice === 'DESC'}
                                        <Icon data={faSortDown} scale={1.5} class="ml-2 mb-2"/>
                                    {:else if orderCondition.totalPrice === 'ASC'}
                                        <Icon data={faSortUp} scale={1.5} class="ml-2 mt-2"/>
                                    {/if}
                                </div>
                            </th>
                            <th class="py-2 px-4 border-b text-right">Quantity</th>
                            <th class="py-2 px-4 border-b text-center cursor-pointer">
                                <div role="button" on:click={() => oderbyHandler('payDate')} on:keydown={() => {}} tabindex="0">
                                    <span>Paid Date</span>
                                    {#if orderCondition.payDate === 'DESC'}
                                        <Icon data={faSortDown} scale={1.5} class="ml-2 mb-2"/>
                                    {:else if orderCondition.payDate === 'ASC'}
                                        <Icon data={faSortUp} scale={1.5} class="ml-2 mt-2"/>
                                    {/if}
                                </div>
                            </th>
                            <th class="py-2 px-4 border-b"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if PaymentList.length === 0}
                        <tr>
                            <td colspan="7" class="py-4 px-4 text-center font-bold text-red-800">No payment data found.</td>
                        </tr>
                        {:else}
                            {#each PaymentList as item, index (index)}
                                <tr class="hover:bg-gray-50">
                                    <td class="text-center border-b">{(recordPerPage * pageIndex) + index + 1}</td>
                                    <td class="py-2 px-4 border-b">
                                        <img src={`${properties.API_SERVER}/${item.imageUrl}`} alt="" class="w-16 h-16 object-cover"/>
                                    </td>
                                    <td class="py-2 px-4 border-b"><a href={`/product/${item.productId}`} class="font-bold hover:underline">{item.name}</a>
                                    <td class="py-2 px-4 border-b text-right"><span class="font-bold text-blue-500">{item.totalPrice.toLocaleString()}</span> 원</td>
                                    <td class="py-2 px-4 border-b text-right"><span class="font-bold">{item.pCnt}</span> 개</td>
                                    <td class="py-2 px-4 border-b text-center">{item.payDate}</td>
                                    <td class="py-2 px-4 border-b text-center">
                                        <button class="btn-red" on:click={() => openReturnPop(item.productId, item.payDate)}>return</button>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
                <Pagination totalCount={totalCount} bind:pageIndex={pageIndex} bind:startIndex={startIndex} recordPerPage={recordPerPage} selectFunc={getPaymentList} pageSize={5}/>
            </div>
        </div>

        <PaymentModal bind:show={show} payDate={popPayDate} productId={popProductId} userId={popUserId} on:close={() => {pageIndex = 0, startIndex= 0, getPaymentList()}}></PaymentModal>
    {/if}
</div>

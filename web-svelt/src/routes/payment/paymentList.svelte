<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { progress } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import { axiosInstance } from "../../module/axiosConfig";
    import { accessToken } from "../../store";
    import type UserPayment from "../../types/UserPayment";
    import properties from "../../property/config";


    let PaymentList: UserPayment[] = [];

    const getPaymentList = async () => {
        commonModule.increaseProgress();

        const userId = (commonModule.decodeJwtToken($accessToken) as any).username;
        const res = await axiosInstance.get<UserPayment[]>(`/payment/${userId}`);

        if (res.status === 200) {
            PaymentList = res.data;
        }
    }

    onMount(getPaymentList);
    onDestroy(commonModule.destroyProgress);
</script>

<div class="container mx-auto px-4 py-8">
    {#if $progress}
        <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
        <ProgressLinear app={true} color="green" progress={$progress}/>
    {:else}
        <h1 class="text-2xl font-bold mb-4">Payment List</h1>
        <div class="container mx-auto p-4 cursor-default">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="py-2 px-4 border-b text-center">썸네일</th>
                    <th class="py-2 px-4 border-b text-center">품명</th>
                    <th class="py-2 px-4 border-b text-center">가격</th>
                    <th class="py-2 px-4 border-b text-center">수량</th>
                    <th class="py-2 px-4 border-b text-center">결제일자</th>
                  </tr>
                </thead>
                <tbody>
                  {#each PaymentList as item, index (index)}
                    <tr class="hover:bg-gray-50">
                      <td class="py-2 px-4 border-b">
                        <img src={`${properties.API_SERVER}/${item.imageUrl}`} alt={item.name} class="w-16 h-16 object-cover"/>
                      </td>
                      <td class="py-2 px-4 border-b">{item.name}</td>
                      <td class="py-2 px-4 border-b text-right">{item.totalPrice.toLocaleString()}원</td>
                      <td class="py-2 px-4 border-b text-right">{item.pCnt}</td>
                      <td class="py-2 px-4 border-b">{item.payDate}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
    {/if}
</div>
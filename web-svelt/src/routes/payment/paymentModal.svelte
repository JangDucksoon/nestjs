<script lang="ts">
    import { faX } from "@fortawesome/free-solid-svg-icons";
    import Icon from 'svelte-awesome';
    import type Product from "../../types/Product";
    import { axiosInstance } from "../../module/axiosConfig";

    export let show: boolean = false;
    export let userId: string;
    export let productId: number;
    export let payDate: string;

    let paidProduct:Product[] = [];

    const getPaidProduct = async () => {
        const res = await axiosInstance.get(`/payment/${userId}/${productId}?payDate=${payDate}`);
    }

    $: show ? getPaidProduct() : null;
</script>

{#if show}
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Return Items</h3>
        <button class="text-gray-600 hover:text-gray-800" on:click={() => show = false}>
            <Icon data={faX} scale={1.0}/>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">ID</th>
              <th class="py-2 px-4 border-b text-left"></th>
              <th class="py-2 px-4 border-b text-left">Name</th>
              <th class="py-2 px-4 border-b text-right">Price</th>
              <th class="py-2 px-4 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- 각 아이템에 대한 반복 시작 -->
            <tr>
              <td class="py-2 px-4 border-b">1</td>
              <td class="py-2 px-4 border-b">
                <img src="product-image-url" alt="" class="w-12 h-12 inline-block mr-2" />
              </td>
              <td class="py-2 px-4 border-b"> Product Name </td>
              <td class="py-2 px-4 border-b text-right">$XX.XX</td>
              <td class="py-2 px-4 border-b text-center">
                <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Return
                </button>
              </td>
            </tr>
            <!-- 각 아이템에 대한 반복 끝 -->
          </tbody>
        </table>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" on:click={() => show = false}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
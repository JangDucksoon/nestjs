<script lang="ts">
	import { faX } from "@fortawesome/free-solid-svg-icons";
	import Icon from "svelte-awesome";
	import { axiosInstance } from "../../module/axiosConfig";
	import type Payment from "../../types/Payment";
	import properties from "../../property/config";
	import { createEventDispatcher } from "svelte";
    import messageModule from "../../module/swalConfig";
    import { commonModule } from "../../module/commonModule";

	export let show: boolean = false;
	export let userId: string;
	export let productId: number;
	export let payDate: string;

	let checkedList: number[] = [];
	let paidProduct: Payment[] = [];

	const dispatch = createEventDispatcher();

	const getPaidProduct = async (reSearch: boolean = false) => {
		commonModule.increaseProgress(1, 'server');
		const res = await axiosInstance.get<Payment[]>(`/payment/${userId}/${productId}?payDate=${payDate}`,);

		if (res?.status === 200) {
			paidProduct = res.data;
			if (reSearch && paidProduct.length === 0) {
				messageModule.alert('There are no payment records, so the popup will be closed.', closeModal, 'info');
			}
		}
	};

	const checkPayment = (evt: Event, all: boolean = false) => {
		const checked = all
			? (document.querySelector("#allCheck") as HTMLInputElement).checked
			: (evt.target as HTMLInputElement).checked;

		if (all) {
			document
				.querySelectorAll(".payment")
				.forEach((e) => ((e as HTMLInputElement).checked = checked));
		} else {
			!checked
				? ((
						document.querySelector("#allCheck") as HTMLInputElement
					).checked = false)
				: null;
		}

		checkedList = [
			...[...document.querySelectorAll(".payment")]
				.filter((e) => (e as HTMLInputElement).checked)
				.map((e) => Number((e as HTMLInputElement).value)),
		];
	};

	const deletePayment = () => {
		messageModule.confirm('Are you sure you want to delete?', async (result: boolean) => {
			if (!result) return;

			const res = await axiosInstance.request({
				url: "/payment",
				method: "delete",
				data: checkedList,
			});

			if (res?.status === 200) {
				checkedList = [];
				getPaidProduct(true);
			}
		});
	};

	const closeModal = () => {
		show = false;
		dispatch("close");
	};

	$: show ? getPaidProduct() : null;
</script>

{#if show}
	<div
		class="fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full flex justify-center items-center"
	>
		<div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-semibold">Return Items</h3>
				<button
					class="text-gray-600 hover:text-gray-800"
					on:click={closeModal}
				>
					<Icon data={faX} scale={1.0} />
				</button>
			</div>

			<div class="overflow-x-auto max-h-[700px] overflow-y-auto">
				<table class="min-w-full bg-white">
					<thead class="bg-gray-100 sticky top-0 z-10">
						<tr>
							<th class="py-2 px-4 border-b text-center">
								<label class="flex items-center space-x-2 cursor-pointer">
									<input
										id="allCheck"
										type="checkbox"
										class="hidden peer"
										on:change={(evt) =>
											checkPayment(evt, true)}
									/>
									<div
										class="w-6 h-6 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"
									></div>
								</label>
							</th>
							<th class="py-2 px-2 border-b text-center">NO</th>
							<th class="py-2 px-2 border-b text-center">ID</th>
							<th class="py-2 px-4 border-b text-center"></th>
							<th class="py-2 px-6 border-b text-left">Name</th>
							<th class="py-2 px-6 border-b text-right">Price</th>
						</tr>
					</thead>
					<tbody>
						<!-- 각 아이템에 대한 반복 시작 -->
						{#each paidProduct as payment, index (payment.payId)}
							<tr>
								<td class="py-2 px-4 border-b">
									<label class="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											class="hidden peer payment"
											value={payment.payId}
											on:change={(evt) =>
												checkPayment(evt, false)}/>
										<div class="w-6 h-6 bg-white border-2 border-gray-300 rounded-md 
											flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
										</div>
									</label>
								</td>
								<td class="py-2 px-2 border-b text-center">{index + 1}</td>
								<td class="py-2 px-2 border-b text-center">{payment.payId}</td>
								<td class="py-2 px-4 border-b text-center">
									<img src={`${properties.API_SERVER}/${payment.product?.image_url}`}	alt="" class="w-12 h-12 inline-block mr-2"/>
								</td>
								<td class="py-2 px-6 border-b text-left">{payment.product?.name}</td>
								<td class="py-2 px-6 border-b text-right"><span class="font-bold text-blue-500">{payment.product?.price.toLocaleString() ||	0}</span> 원</td
								>
							</tr>
						{/each}
						<!-- 각 아이템에 대한 반복 끝 -->
					</tbody>
				</table>
			</div>

			<div class="mt-6 flex justify-between items-center">
				<span class="font-bold text-lg text-blue-700"
					>{checkedList.length} 개</span
				>
				<div>
					<button
						disabled={checkedList.length === 0}
						class="bg-red-500 text-white px-4 py-2 rounded transform: scale-100 transition-all duration-300 ease-in-out
				hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-red-500"
						on:click={deletePayment}>selected Returns</button
					>
					<button
						class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						on:click={closeModal}>Close</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

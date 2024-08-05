<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { commonModule } from "../../module/commonModule";
    import { progress } from "../../store";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import TextField from "../../components/TextField/TextField.svelte";
    import type Product from "../../types/Product";
    import properties from "../../property/config";
    import { navigate } from "svelte-routing";
    import messageModule from "../../module/swalConfig";
    import { v4 as uuidv4 } from "uuid";
    import { format } from "date-fns";
    import { axiosMultipartInstance } from "../../module/axiosConfig";

    let thumbnail: string = '';
    let product: Partial<Product> = {}

    const submitHandler = () => {
        messageModule.confirm('Shall we proceed with product registration?', async (result: boolean) => {
            if (!result) return;

            const formData = new FormData();

            const fileInput = document.getElementById('image') as HTMLInputElement;
            const file = fileInput && fileInput.files ? fileInput.files[0]:null;

            if (file) {
                const uuid = uuidv4();
                const dateFormat: string = format(new Date(), 'yyyyMMddHHmmss');
                const filename: string = file.name.replaceAll(' ', '_');
                product.image_url = `images/products/${uuid}_${dateFormat}_${filename}`;

                formData.append('file', file);
            }

            Object.keys(product).forEach(key => formData.append(key, product[key]));

            try {
                const res = await axiosMultipartInstance.post<Record<string, string|number>>('/product', formData);
                
                if (res.status === 201) {
                    messageModule.alert('It has been successfully saved.', () => {
                        navigate(`/product/${res.data.id}`);
                    });
                } else {
                    messageModule.error('Failed to save.');
                }
            } catch(err) {
                
            }
        });
    }

    const handleImageChange = (evt: Event) => {
        const fileInput = evt.target as HTMLInputElement;
        
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                thumbnail = (reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            thumbnail = `${properties.API_SERVER}/${product?.image_url}`;
        }
    }

    onMount(() => {
        commonModule.increaseProgress(1);
    });

    onDestroy(() => {
        commonModule.destroyProgress();
    })
</script>

{#if $progress}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color='purple' progress={$progress}/>
{:else}
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Registry Product</h1>
        <div class="flex gap-20">
            <div class="flex-1 flex items-start">
                <img id="thumnail" src={thumbnail} alt="" class="image"/>
            </div>
            <div class="flex-1">
                <form class="w-full mx-auto" on:submit|preventDefault={submitHandler}>
                    <div class="mb-10">
                        <TextField label="Name" outlined hint="Wrtie the product name here" bind:value={product.name} required/>
                    </div>
                    <div class="mb-10">
                        <TextField label="Description" outlined hint="Wrtie the product description here" textarea rows={5} bind:value={product.description} required/>
                    </div>
                    <div class="mb-10">
                        <TextField label="Price" outlined hint="Wrtie the product price here" bind:value={product.price} on:input={commonModule.coonvertToNumber} required/>
                    </div>
                    <div class="mb-10">
                        <label for="image" class="block mb-2">Image:</label>
                        <input id="image" type="file" accept="image/*" on:change={handleImageChange} class="w-full p-2 border rounded"/>
                    </div>
                    <div class="mb-10 flex justify-between">
                        <button type="button" class="btn" on:click={() => navigate(`/product/`)}>Back</button>
                        {#if commonModule.checkAdministrator()}
                            <button type="submit" class="btn-green">Register Product</button>
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    .image {
        @apply w-full h-4/5 object-contain rounded-lg shadow-lg border border-gray-300 mt-0;
    }
</style>
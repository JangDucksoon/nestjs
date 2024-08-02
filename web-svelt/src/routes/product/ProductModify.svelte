<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import {axiosMultipartInstance, axiosInstance} from "../../module/axiosConfig";
    import type Product from "../../types/Product";
    import { navigate } from "svelte-routing";
    import properties from "../../property/config";
    import messageModule from "../../module/swalConfig";
    import { v4 as uuidv4 } from "uuid";
    import { format } from "date-fns";
    import TextField from "../../components/TextField/TextField.svelte";
    import { progress } from "../../store";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { commonModule } from "../../module/commonModule";
    
    export let id: number;

    let product: Product = {
        id: 0,
        name: "",
        description: "",
        price: 0,
        image_url: "",
    };

    let loadedProduct: Product = {
        id: 0,
        name: "",
        description: "",
        price: 0,
        image_url: "",
    };

    let error: string | null = null;
    let thumbnail: string | null = null;

    const getProduct = async (id: number) => {
        commonModule.increaseProgress(1);
        axiosInstance
            .get<Product>(`product/${id}`)
            .then((res) => {
                product = res.data;
                loadedProduct = { ...res.data };
            })
            .catch((err) => (error = err));
    };

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

    const deleteHandler = () => {
        messageModule.confirm('Are you sure you want to delete this product?', async (result: boolean) => {
            if (!result) return;

            const res = await axiosInstance.delete(`/product/${id}`);
            
            if (res.statusText === 'OK') {
                messageModule.alert('Product deleted successfully!', () => navigate(`/product`),'success');
            }
        });
    }

    const submitHandler = () => {
        messageModule.confirm('Would you like to save your changes?', async (result: boolean) => {
            if (!result) return;

            let modifiedProduct: Partial<Product> = {};

            Object.keys(product).forEach((col) => {
                if (product[col] !== loadedProduct[col]) {
                    modifiedProduct[col] = product[col];
                }
            });

            const fileInput = document.getElementById('image') as HTMLInputElement;
            const file = fileInput && fileInput.files ? fileInput.files[0]:null;

            if (Object.keys(modifiedProduct).length > 0 || file) {
                const formData = new FormData();

                if (file) {
                    formData.append('file', file);

                    const uuid: string = uuidv4();
                    const dateFormat: string = format(new Date(), 'yyyyMMddHHmmss');
                    const filename: string = file.name.replaceAll(' ', '_');
                    const image_url: string = `images/products/${uuid}_${dateFormat}_${filename}`;

                    modifiedProduct.image_url = image_url;
                }

                Object.keys(modifiedProduct).forEach(key => formData.append(key, modifiedProduct[key]));

                const res = await axiosMultipartInstance.patch(`/product/${id}`, formData);

                if (res.status == 200) {
                    messageModule.alert("Successfully modified", () =>
                        navigate(`/product/${id}`),
                    );
                } else {
                    messageModule.error("error");
                }
            } else {
                messageModule.alert("There are no changes.", null, 'warning');
            }
        })
    };

    onMount(() => getProduct(id));

    onDestroy(() => commonModule.destroyProgress());
</script>

{#if $progress !== 0}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear color="purple" progress={$progress}/>
{:else if error}
    <p class="text-center text-red-500">{error}</p>
{:else if product}
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Edit Product</h1>
        <div class="flex gap-20">
            <div class="flex-1 flex items-start">
                <img id="thumnail" src={thumbnail ? thumbnail:`${properties.API_SERVER}/${product?.image_url}`} alt={product?.name} class="image"/>
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
                        <TextField label="Price" outlined hint="Wrtie the product price here" bind:value={product.price} required on:input={commonModule.coonvertToNumber}/>
                    </div>
                    <div class="mb-10">
                        <label for="image" class="block mb-2">Image:</label>
                        <input id="image" type="file" accept="image/*" on:change={handleImageChange} class="w-full p-2 border rounded"/>
                    </div>
                    <div class="mb-10 flex justify-between">
                        <button type="button" class="btn" on:click={() => navigate(`/product/${id}`)}>Back</button>
                        <div>
                            <button type="button" class="btn-red" on:click={deleteHandler}>Delete Product</button>
                            <button type="submit" class="btn-green">Update Product</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
{:else}
    <p class="text-center text-red-500">Product doesn't exist</p>
{/if}

<style lang="postcss">
    .image {
        @apply w-full h-4/5 object-contain rounded-lg shadow-lg border border-gray-300 mt-0;
    }
</style>

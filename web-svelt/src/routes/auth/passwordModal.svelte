<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TextField from "../../components/TextField/TextField.svelte";
    import messageModule from "../../module/swalConfig";

    export let show: boolean = false;
    let password: string;

    const dispatch = createEventDispatcher();

    const sendPassword = () => {
        if (!password) {
            messageModule.alert('Password is required', null, 'warning');
            return;
        }

        dispatch('sendPassword', {password: password});
        password = '';
        show = false;
    }

</script>

{#if show}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Enter Your Password</h2>
            <form on:submit|preventDefault={sendPassword}>
                <TextField type="password" hint="Enter your password" outlined label="Password" required class="w-full" bind:value={password}/>
                <div class="mt-4 flex justify-end space-x-2">
                    <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md" on:click={() => show = false}>
                        Cancel
                    </button>
                    <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
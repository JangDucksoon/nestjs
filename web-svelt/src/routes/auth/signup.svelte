<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { commonModule } from "../../module/commonModule";
    import { accessToken, progress, refreshToken } from "../../store";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import TextField from "../../components/TextField/TextField.svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import messageModule from "../../module/swalConfig";
    import { navigate } from "svelte-routing";

    let username: string = "";
    let password: string = "";
    
    const signupHandler = async () => {
        const res = await axiosInstance.post<any>('/auth', {username, hashedPassword: password});

        if (res?.status === 201) {
            const { access_token, refresh_token } = res.data;
            accessToken.set(access_token);
            refreshToken.set(refresh_token);

            messageModule.alert("Login successful!", () => {
                navigate('/');
            }, 'success');
        }
    }

    onMount(() => commonModule.increaseProgress(0.1));
    onDestroy(() => commonModule.destroyProgress());
</script>

{#if $progress}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="purple" progress={$progress}/>
{:else}
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Sing Up</h1>
        <form on:submit|preventDefault={() => {}} class="space-y-10">
            <div>
                <TextField label="Username" bind:value={username} outlined hint="Write here your ID" required on:input={commonModule.filterHangleAndSpace}/>
            </div>
            <div>
                <TextField label="Password" type="password" bind:value={password} outlined hint="Write here your password" required on:input={commonModule.filterHangleAndSpace}/>
            </div>
            <div>
                <button type="button" class="btn-purple w-full" on:click={signupHandler}>
                    Sign up
                </button>
            </div>
        </form>
    </div>
{/if}
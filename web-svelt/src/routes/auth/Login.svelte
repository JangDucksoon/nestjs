<script lang="ts">
    import { navigate } from "svelte-routing";
    import TextField from "../../components/TextField/TextField.svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import messageModule from "../../module/swalConfig";
    import { accessToken, progress, refreshToken } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { onDestroy, onMount } from "svelte";

    let username: string;
    let password: string;

    const loginHandler = async () => {
        const user = { username, password };

        const res = await axiosInstance.post<Record<'access_token'|'refresh_token'|'test_token', string>>("/auth/login", user);
        
        if (res.status === 200 || res.status === 201) {
            const { access_token, refresh_token, test_token } = res.data;
            accessToken.set(access_token);
            refreshToken.set(refresh_token);
            localStorage.setItem('testToken', test_token);


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
    <ProgressLinear app={true} color="indigo" progress={$progress}/>
{:else}
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Login</h1>
        <form on:submit|preventDefault={loginHandler} class="space-y-10">
            <div>
                <TextField label="Username" bind:value={username} outlined hint="Write here your ID" required on:input={commonModule.filterHangleAndSpace}/>
            </div>
            <div>
                <TextField label="Password" type="password" bind:value={password} outlined hint="Write here your password" required on:input={commonModule.filterHangleAndSpace}/>
            </div>
            <div>
                <button type="submit" class="btn-green w-full">
                    Login
                </button>
            </div>
        </form>
    </div>
{/if}

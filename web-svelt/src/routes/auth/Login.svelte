<script lang="ts">
    import TextField from "../../components/TextField/TextField.svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import messageModule from "../../module/swalConfig";

    let username: string;
    let password: string;

    const loginHandler = async () => {
        const user = { username, password };

        try {
            const res = await axiosInstance.post<Record<'access_token'|'refresh_token', string>>("/auth/login", user);
            
            if (res.status === 200 || res.status === 201) {
                const { access_token: accessToken, refresh_token: refreshToken } = res.data;
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
            }

        } catch (error: any) {
            if (error.response.status !== 401) {
                messageModule.error(`Login failed<br><span class="text-red-500 font-bold">[ ${error.message} ]<span>`);
            }
        }
    }

    const handleInputChange = (evt: Event) => {
        const input = evt.target as HTMLInputElement
        const value = input.value;
        const filterValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣| ]/g, '');

        input.value = filterValue;
    }
</script>
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Login</h1>
    <form on:submit|preventDefault={loginHandler} class="space-y-10">
        <div>
            <TextField label="Username" bind:value={username} outlined hint="Write here your ID" required on:input={handleInputChange}/>
        </div>
        <div>
            <TextField label="Password" type="password" bind:value={password} outlined hint="Write here your password" required on:input={handleInputChange}/>
        </div>
        <div>
            <button type="submit" class="btn-green w-full">
                Login
            </button>
        </div>
    </form>
</div>

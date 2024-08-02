<script>
    import TextField from "../../components/TextField/TextField.svelte";
</script>
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Login</h1>
    <form on:submit|preventDefault={() => {}} class="space-y-10">
        <div>
            <TextField label="Username" outlined hint="Write here your ID" required/>
        </div>
        <div>
            <TextField label="password" type="password" outlined hint="Write here your password" required autocomplete="off"/>
        </div>
        <div>
            <button type="submit" class="btn-green w-full">
                Login
            </button>
        </div>
    </form>
</div>

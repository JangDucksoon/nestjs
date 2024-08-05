<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../components/ProgressLinear/ProgressLinear.svelte";
    import { progress } from "../store";
    import { commonModule } from "../module/commonModule";

    onMount(() => commonModule.increaseProgress(0.1));
    onDestroy(() => commonModule.destroyProgress());
</script>

{#if $progress !== 0}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="yellow" progress={$progress}/>
{:else}
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to Home</h1>
        <p class="text-xl">This is the home page of our Svelte Route.</p>
    </div>
{/if}
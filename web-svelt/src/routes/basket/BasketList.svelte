<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { progress } from "../../store";
    import { commonModule } from "../../module/commonModule";

    onMount(() => commonModule.increaseProgress(0.1));
    onDestroy(() => commonModule.destroyProgress());
</script>

{#if $progress}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="green" progress={$progress}/>
{:else}
    basket list
{/if}
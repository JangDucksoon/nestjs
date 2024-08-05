<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import ProgressLinear from "../components/ProgressLinear/ProgressLinear.svelte";
    import { progress } from "../store";
    import { commonModule } from "../module/commonModule";

	onMount(() => commonModule.increaseProgress(0.1));
    onDestroy(commonModule.destroyProgress);
</script>

{#if $progress !== 0}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="yellow" progress={$progress}/>
{:else}
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">About Us</h1>
    <p class="text-xl">Welcome to our Svelte test page! We're currently exploring the powerful features and reactivity of Svelte. This page demonstrates various components and state management techniques, showcasing the simplicity and efficiency of Svelte development. Stay tuned as we continue to expand and refine our Svelte-based application.</p>
  </div>
{/if}
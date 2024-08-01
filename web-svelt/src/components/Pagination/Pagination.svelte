<script lang="ts">
    import { onMount } from "svelte";

    export let totalCount: number = 0;
    export let pageIndex: number = 0;
    export let pageSize: number = 10;
    export let recordPerPage: number = 10;
    export let selectFunc: Function;
    export let startIndex: number = 0; //페이지 시작인덱스 >나 <를 눌렀을때의 첫 페이지 인덱스
    let totalPageSize: number = parseInt(((totalCount - 1)/recordPerPage) + 1);

    const defaultClasses = 'px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100';

    onMount(() => {
        preventToMovePage();
    });

    const pageMove = async (cPageIndex: number) => {
        const skip = cPageIndex * recordPerPage;
        const limit = recordPerPage;

        selectFunc(cPageIndex);
        pageIndex = cPageIndex;
    }

    const nextPageSize = () => {
        if (startIndex + pageSize < totalPageSize) {
            startIndex += pageSize;
            pageMove(startIndex);
        } else {
            pageMove(totalPageSize - 1);
        }
    }

    const previousPageSize = () => {
        if (startIndex - pageSize >= 0) {
            startIndex -= pageSize;
            pageMove(startIndex + pageSize - 1)
        } else {
            pageMove(0);
        }
    }

    const preventToMovePage = () => {
        document.querySelectorAll('#pagination #pageNav a').forEach(a => {
            a.addEventListener('click', (evt) => {
                evt.preventDefault();
            });
        });
    }
</script>

<div id="pagination" class="flex justify-center mt-8">
    <nav id="pageNav" class="flex items-center space-x-1">
        <button type="button" class={defaultClasses} on:click={previousPageSize}>&lt;</button>
        {#each Array(pageSize) as _, index}
            {#if (startIndex + index) < totalPageSize}
                <button type="button" class={defaultClasses + ((startIndex + index) == pageIndex ? ' active':'')} on:click={() => pageMove(startIndex + index)}>{startIndex + index + 1}</button>
            {/if}
        {/each}
        <button type="button" class={defaultClasses} on:click={nextPageSize}>&gt;</button>
    </nav>
</div>

<style lang="postcss">
    .active {
        @apply text-white bg-blue-500 border
    }
</style>
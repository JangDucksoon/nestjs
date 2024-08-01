<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let app = false;
  export let progress = 0;
  export let color = "primary";

  let initialized = false;

  onMount(() => {
    if (!app) return;

    setTimeout(() => {
      initialized = true;
    }, 200);
  });
</script>

<style>
  /* kudos https://codepen.io/shalimano/pen/wBmNGJ */
  .inc {
    animation: increase 2s ease-in-out infinite;
  }
  .dec {
    animation: decrease 2s 0.9s ease-in-out infinite;
  }

  @keyframes increase {
    from {
      left: -5%;
      width: 5%;
    }
    to {
      left: 130%;
      width: 150%;
    }
  }
  @keyframes decrease {
    from {
      left: -90%;
      width: 90%;
    }
    to {
      left: 110%;
      width: 10%;
    }
  }
</style>

<div
  class:fixed={app}
  class:z-50={app}
  class="top-0 left-0 w-full h-1 overflow-hidden relative"
  class:hidden={app && !initialized}
  class:bg-red-100={color === 'red'}
  class:bg-blue-100={color === 'blue'}
  class:bg-green-100={color === 'green'}
  class:bg-yellow-100={color === 'yellow'}
  class:bg-indigo-100={color === 'indigo'}
  class:bg-purple-100={color === 'purple'}
  class:bg-pink-100={color === 'pink'}
  class:bg-gray-100={color === 'gray'}
  class:bg-primary-100={color === 'primary'}
  transition:slide={{ duration: 300 }}>
  <div
    class="h-1 absolute"
    class:inc={!progress}
    class:transition={progress}
    class:bg-red-500={color === 'red'}
    class:bg-blue-500={color === 'blue'}
    class:bg-green-500={color === 'green'}
    class:bg-yellow-500={color === 'yellow'}
    class:bg-indigo-500={color === 'indigo'}
    class:bg-purple-500={color === 'purple'}
    class:bg-pink-500={color === 'pink'}
    class:bg-gray-500={color === 'gray'}
    class:bg-primary-500={color === 'primary'}
    style={progress ? `width: ${progress}%` : ""} />
  <div
    class="h-1 absolute dec"
    class:hidden={progress}
    class:bg-red-500={color === 'red'}
    class:bg-blue-500={color === 'blue'}
    class:bg-green-500={color === 'green'}
    class:bg-yellow-500={color === 'yellow'}
    class:bg-indigo-500={color === 'indigo'}
    class:bg-purple-500={color === 'purple'}
    class:bg-pink-500={color === 'pink'}
    class:bg-gray-500={color === 'gray'}
    class:bg-primary-500={color === 'primary'} />
</div>
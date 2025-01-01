<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    export let isIntersecting = false;

    let observer: IntersectionObserver;

    let observedElement: HTMLElement;

    onMount(() => {
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("intersecting");
                    isIntersecting = true;
                    dispatch("intersect");
                }
            });
        });

        observer.observe(observedElement);

        return () => {
            observer.disconnect();
        };
    });

    const dispatch = createEventDispatcher<{
        intersect: void;
    }>();
</script>

<div class="observer" bind:this={observedElement}></div>

<style>
    .observer {
        position: relative;
        width: 0px;
        height: 0px;
        opacity: 0;
    }
</style>

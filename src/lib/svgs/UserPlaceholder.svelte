<script lang="ts">
    import placeholder from '$lib/images/placeholder.png';
    import { onMount } from "svelte";

    export let url = "";
    $: img = (url) ? "data:image/jpeg;base64," +  url : placeholder;


    let container: HTMLDivElement;


    onMount(() => {
        const resize = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            container.style.width = containerWidth + "px";
            container.style.height = containerHeight + "px";
        };

        resize();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        };
    });
</script>

<div id="container" bind:this={container}>
    <!-- <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" class="dark-blue"/>
        <g opacity="0.2">
            <path d="M68.5938 74.2187C62.6563 71.5625 60.4688 67.6562 59.8438 64.0625C64.2188 60.625 67.5 55 69.375 49.0625C71.25 46.5625 72.5 44.0625 72.5 41.875C72.5 40.3125 72.0313 39.375 70.9375 38.4375C70.625 25.7813 61.7188 15.625 50.625 15.4688C50.4688 15.4688 50.4688 15.4688 50.3125 15.4688C50.3125 15.4688 50.3125 15.4688 50.1562 15.4688C39.0625 15.4688 30.1562 25.4687 29.6875 37.9688C28.2812 38.75 27.5 40 27.5 41.875C27.5 44.375 29.0625 47.5 31.7187 50.3125C33.5937 55.4688 36.5625 60.3125 40.3125 63.4375C39.6875 67.0312 37.6562 71.25 31.4062 74.0625C27.9688 75.4688 21.875 76.875 19.2188 78.125C25.9375 85.9375 38.9062 90.625 49.8437 90.625H50C60.9375 90.625 73.9063 85.9375 80.7813 78.4375C78.125 77.0313 72.0313 75.7812 68.5938 74.2187Z" class="black"/>
        </g>
        <path d="M68.5938 71.0937C62.6563 68.4375 60.4688 64.5312 59.8438 60.9375C64.2188 57.5 67.5 51.875 69.375 45.9375C71.25 43.4375 72.5 40.9375 72.5 38.75C72.5 37.1875 72.0313 36.25 70.9375 35.3125C70.625 22.6563 61.7188 12.5 50.625 12.3438C50.4688 12.3438 50.4688 12.3438 50.3125 12.3438C50.3125 12.3438 50.3125 12.3438 50.1562 12.3438C39.2187 12.5 30.3125 22.5 29.6875 35C28.2812 35.7812 27.5 37.0312 27.5 38.9062C27.5 41.4062 29.0625 44.5312 31.7187 47.3438C33.5937 52.5 36.5625 57.3438 40.3125 60.4688C39.6875 64.0625 37.6562 68.2812 31.4062 71.0937C27.9688 72.5 21.875 73.9062 19.2188 75.1562C25.9375 82.8125 38.9062 87.5 49.8437 87.5H50C60.9375 87.5 73.9063 82.8125 80.7813 75.3125C78.125 73.9062 72.0313 72.6562 68.5938 71.0937Z" class="light-blue"/>
    </svg> -->
    <img src={img} alt="User profile icon">
</div>
    
<style scoped lang="scss">
    @import '$lib/styles/variables.scss';

    .light-blue {
        fill: $color-light-blue;
    }

    .dark-blue {
        fill: $color-dark-blue;
    }

    .black {
        fill: $color-black;
    }

    #container {
        height: 100%;
        aspect-ratio: 100 / 100;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }
</style>
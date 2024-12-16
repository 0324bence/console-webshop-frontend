<script lang="ts">
    import LocationSearch from "$lib/components/LocationSearch.svelte";
    import type { Location } from "$lib/types";

    let location: Location | undefined;

    $: console.log(location);
</script>

<div id="testing">
    <LocationSearch bind:selectedLocation={location} />
</div>

<style>
    #testing {
        /* border: 1px solid red; */
        width: 30rem;
        margin: 2rem;
    }
</style>

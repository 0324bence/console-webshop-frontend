<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    console.log(data);
</script>

<slot></slot>
<div class="main-container">
    <form id="filter-container" method="post" action="/search?/filters">
        <button id="search" type="submit">Keresés</button>
        <div id="state">
            {#each data.filters.states as state}
                <label for={"states" + state.id}>{state.name}</label>
                <input
                    type="checkbox"
                    name="state"
                    id={"states" + state.id}
                    value={state.id}
                    checked={data.activeFilters.states.includes(state.id)}
                />
            {/each}
        </div>
    </form>
    <div id="sorting-container"></div>
    <div id="advert-container">
        {data.adverts.items.length}
    </div>
</div>

<style lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        display: grid;
        grid-template-columns: 3fr 17fr;
        grid-template-rows: 1fr 15fr;

        #filter-container {
            grid-row: span 2;
        }

        div {
            border: 1px solid black;
        }
    }
</style>

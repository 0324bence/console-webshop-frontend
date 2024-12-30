<script lang="ts">
    import apiPath from "$lib/apiPath";
    import type { LocalAdvert, Model, Picture } from "$lib/types";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { afterNavigate, goto, invalidate, invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";
    interface LocalPicture extends Picture {
        object: HTMLImageElement;
    }

    interface CheckBoxModel extends Model {
        checked: boolean;
    }

    interface ExtendedAdvert extends LocalAdvert {
        mainPicture: LocalPicture;
    }

    export let data: PageData;

    let userId: number | undefined = undefined;

    if ($page.url.pathname.search("/profile/") !== -1) {
        userId = $page.data.user.id;
    }

    let adverts: ExtendedAdvert[] = [];

    let models: CheckBoxModel[] = [];

    async function getModels(manufacturerId: number) {
        const resp = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${manufacturerId}`);
        let ldata = await resp.json();
        ldata = ldata.map((model: Model) => {
            return {
                ...model,
                checked: false
            };
        });
        models = [...models, ...ldata];
    }

    async function onManufacturerSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        if (target.checked) {
            await getModels(value);
        } else {
            models = models.filter(model => model.manufacturerId !== value);
        }
    }

    onMount(async () => {
        console.log(userId);
        for (const manufacturerId of data.activeFilters.manufacturers) {
            await getModels(manufacturerId);
        }
        adverts = data.adverts.map(advert => {
            const newAdvert = {
                ...advert,
                mainPicture: {
                    ...advert.mainPicture,
                    object: new window.Image()
                }
            };
            newAdvert.mainPicture.object.src = `data:image/jpeg;base64,${advert.mainPicture.data}`;
            return newAdvert;
        });
    });

    function changeSorting(e: Event) {
        console.log($page.url);
        const sortingValue = (e.target as HTMLSelectElement).value;
        const sorting = sortingValue.split("-");
        const localUrl = new URL($page.url.href);
        if (sorting[0].length === 0) {
            localUrl.searchParams.delete("sortBy");
            localUrl.searchParams.delete("sortOrder");
        } else {
            localUrl.searchParams.set("sortBy", sorting[0]);
            localUrl.searchParams.set("sortOrder", sorting[1]);
        }
        goto(
            localUrl.pathname +
                localUrl.search +
                (localUrl.search.length > 0 && localUrl.search[localUrl.search.length - 1] !== "&" ? "&" : "")
        );
    }

    let searchForm: HTMLFormElement;
    let timeout: number;

    function changeSearch() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("submit", userId);
            searchForm.submit();
        }, 500);
    }

    afterNavigate(() => {
        invalidateAll();
        if ($page.url.pathname.search("/profile/") !== -1) {
            userId = $page.data.user.id;
        } else {
            userId = undefined;
        }
        console.log(userId);
        adverts = data.adverts.map(advert => {
            const newAdvert = {
                ...advert,
                mainPicture: {
                    ...advert.mainPicture,
                    object: new window.Image()
                }
            };
            newAdvert.mainPicture.object.src = `data:image/jpeg;base64,${advert.mainPicture.data}`;
            return newAdvert;
        });
    });
</script>

<slot></slot>
<div class="main-container">
    <form id="filter-container" method="post" action="/search?/filters" bind:this={searchForm}>
        <!-- <div class="filter-group"><button id="search" type="submit">Keresés</button></div> -->
        <input type="text" name="title" id="title" class="hidden" value={data.activeFilters.title} />
        <input type="text" name="sortBy" id="sortBy" class="hidden" value={data.activeFilters.sortBy} />
        <input type="text" name="sortOrder" id="sortOrder" class="hidden" value={data.activeFilters.sortOrder} />
        <input type="text" name="userId" id="userId" class="hidden" bind:value={userId} />
        <div id="state" class="filter-group">
            <h2>Állapot</h2>
            <hr />
            {#each data.filters.states as state}
                <div class="checkboxgroup">
                    <input
                        type="checkbox"
                        name="state"
                        id={"states" + state.id}
                        value={state.id}
                        checked={data.activeFilters.states.includes(state.id)}
                        on:change={changeSearch}
                    />
                    <label for={"states" + state.id}>{state.name}</label>
                </div>
            {/each}
        </div>
        <div id="manufacturer" class="filter-group">
            <h2>Gyártó</h2>
            <hr />
            {#each data.filters.manufacturers as manufacturer}
                <div class="checkboxgroup">
                    <input
                        type="checkbox"
                        name="manufacturer"
                        id={"manufacturers" + manufacturer.id}
                        value={manufacturer.id}
                        checked={data.activeFilters.manufacturers.includes(manufacturer.id)}
                        on:change={onManufacturerSelect}
                        on:change={changeSearch}
                    />
                    <label for={"manufacturers" + manufacturer.id}>{manufacturer.name}</label>
                </div>
            {/each}
        </div>
        <div id="model" class="filter-group">
            <h2>Modell</h2>
            <hr />
            {#each models as model}
                <div class="checkboxgroup">
                    <label for={"models" + model.id}>{model.name}</label>
                    <input
                        type="checkbox"
                        name="model"
                        id={"models" + model.id}
                        value={model.id}
                        checked={data.activeFilters.models.includes(model.id)}
                        on:change={changeSearch}
                    />
                </div>
            {/each}
        </div>
    </form>
    <div id="sorting-container">
        <div class="sorting-group">
            <select
                name="sorting"
                id="sorting"
                on:change={changeSorting}
                value={`${data.activeFilters.sortBy}-${data.activeFilters.sortOrder}`}
            >
                <option value="-">Alap</option>
                <option value="priceHuf-ASC">Ár növekvő</option>
                <option value="priceHuf-DESC">Ár csökkenő</option>
                <option value="title-ASC">A-Z</option>
                <option value="title-DESC">Z-A</option>
            </select>
        </div>
    </div>
    <div id="advert-container">
        {#each adverts as advert}
            <div class="advert">
                <div class="image">
                    <img
                        src={`data:image/jpeg;base64,${advert.mainPicture.data}`}
                        alt="advert main"
                        style={`aspect-ratio: ${advert.mainPicture.object.width} / ${advert.mainPicture.object.height}; ${advert.mainPicture.object.width > advert.mainPicture.object.height ? "width: 100%;" : "height: 100%;"}`}
                    />
                </div>
                <div class="data">
                    <h2>{advert.title}</h2>
                    <p>{advert.description}</p>
                    <h3>{advert.priceHuf} HUF</h3>
                    <h3>{advert.location.name}</h3>
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" scoped>
    @import "$lib/styles/variables.scss";
    .main-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 3fr 17fr;
        padding-top: 0.5rem;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        grid-template-rows: 2rem 15fr;

        .hidden {
            display: none;
        }

        #sorting-container {
            display: flex;
            justify-content: end;
            align-items: center;

            .sorting-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.2rem;
                background-color: $color-white;
                border-radius: 0.3rem;
                box-shadow: 1px 1px 5px 0px $color-black;
                padding: 0.5rem;
            }
        }

        #filter-container {
            grid-row: span 2;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .filter-group {
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
                background-color: $color-white;
                border-radius: 0.3rem;
                box-shadow: 1px 1px 5px 0px $color-black;
                padding: 0.5rem;
            }

            .checkboxgroup {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }
        }

        #advert-container {
            display: grid;
            grid-template-columns: repeat(5, 18rem);
            grid-template-rows: repeat(auto-fill, 20rem);
            padding: 1rem;
            gap: 1rem;
            .advert {
                display: grid;
                grid-template-rows: 1fr 1fr;
                width: 100%;
                padding: 1rem;
                border-radius: 0.3rem;
                height: 100%;
                // border: 1px solid $color-black;
                background-color: $color-white;
                box-shadow: 1px 1px 5px 0px $color-black;

                div {
                    border: none;
                    min-height: 0;
                    min-width: 0;
                }

                .image {
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: darken($color-white, 10%);
                }

                img {
                    // width: 100%;
                }
            }
        }

        .checkboxgroup {
            display: flex;
            flex-direction: column;
        }
    }
</style>

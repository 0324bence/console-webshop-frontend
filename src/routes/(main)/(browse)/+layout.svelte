<script lang="ts">
    import apiPath from "$lib/apiPath";
    import type { LocalAdvert, Model, Picture } from "$lib/types";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { afterNavigate, goto, invalidate, invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import noImage from "$lib/images/noImage";
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

    function getManufacturerName(manufacturerId: string) {
        return data.filters.manufacturers.find(
            (manufacturer: { id: number }) => manufacturer.id === parseInt(manufacturerId)
        )?.name;
    }

    let userId: number | undefined = undefined;

    if ($page.url.pathname.search("/profile/") !== -1) {
        userId = $page.data.user.id;
    }

    let adverts: ExtendedAdvert[] = [];

    let modelGroups: { [key: string]: CheckBoxModel[] } = {};

    async function getModels(manufacturerId: number) {
        const resp = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${manufacturerId}`);
        let ldata: CheckBoxModel[] = await resp.json();
        ldata = ldata.map((model: Model) => {
            return {
                ...model,
                checked: false
            };
        });
        modelGroups[manufacturerId.toString()] = ldata;
    }

    async function onManufacturerSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        const manufacturerId = target.getAttribute("data-manufacturerId")!;
        if (target.checked) {
            await getModels(value);
        } else {
            delete modelGroups[manufacturerId];
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
    let timeout: any;

    function changeSearch() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("submit", userId);
            searchForm.submit();
        }, 500);
    }

    let loadingAdverts = false;

    async function loadMoreAdverts() {
        if (data.advertCount == undefined || adverts.length >= data.advertCount) {
            return;
        }
        console.log("loading more adverts", adverts.length);
        loadingAdverts = true;
        const advertsReq = await fetch(
            `${apiPath}/adverts?${$page.url.search}${$page.url.search.length > 0 ? "&" : ""}skip=${adverts.length}`
        );
        const advertsRes = await advertsReq.json();
        const newAdverts: ExtendedAdvert[] = advertsRes.items;
        for (const advert of newAdverts) {
            const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/primaryPicture`);
            if (picturesReq.ok) {
                try {
                    let pictures: Picture = await picturesReq.json();
                    advert.mainPicture = { ...pictures, object: new window.Image() };
                } catch (error) {
                    advert.mainPicture = {
                        id: 0,
                        data: noImage,
                        description: "Nincs megadva kép",
                        advertId: advert.id,
                        isPriority: 1,
                        object: new window.Image()
                    };
                }
            } else {
                // advert.pictures = [
                // {
                //     id: 0,
                //     data: noImage,
                //     description: "Nincs megadva kép",
                //     advertId: advert.id,
                //     isPriority: 1
                // }
                // ];
                advert.mainPicture = {
                    id: 0,
                    data: noImage,
                    description: "Nincs megadva kép",
                    advertId: advert.id,
                    isPriority: 1,
                    object: new window.Image()
                };
            }
            advert.mainPicture.object.src = `data:image/jpeg;base64,${advert.mainPicture.data}`;
            const locationReq = await fetch(`${apiPath}/filters/locations/${advert.locationId}`);
            if (locationReq.ok) {
                advert.location = await locationReq.json();
            } else {
                advert.location = {
                    id: 0,
                    name: "Ismeretlen",
                    county: "Ismeretlen",
                    zip: 0,
                    latitude: "0",
                    longitude: "0"
                };
            }
        }
        adverts = [...adverts, ...newAdverts];
        loadingAdverts = false;
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
        <div id="model" class="filter-group models-group">
            <h2>Modell</h2>
            <hr />
            {#each Object.entries(modelGroups) as [key, models]}
                <div class="manufacturer-title">
                    <p>
                        {getManufacturerName(key)}
                    </p>
                    <hr />
                </div>
                {#each models as model}
                    <div class="checkboxgroup">
                        <input
                            type="checkbox"
                            name="model"
                            id={"models" + model.id}
                            value={model.id}
                            data-manufacturerId={model.manufacturerId}
                            checked={data.activeFilters.models.includes(model.id)}
                            on:change={changeSearch}
                        />
                        <label for={"models" + model.id}>{model.name}</label>
                    </div>
                {/each}
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
    <!-- TODO growing space under adverts on scroll -->
    <div id="advert-container">
        {#if adverts.length == 0}
            <div class="no-adverts">Nincs találat</div>
        {/if}
        {#each adverts as advert, index}
            <a href={`advert/${advert.id}`} class="advert">
                {#if index == adverts.length - 6}
                    <IntersectionObserver on:intersect={loadMoreAdverts} />
                {/if}
                <div class="image">
                    <img
                        src={`data:image/jpeg;base64,${advert.mainPicture.data}`}
                        alt="advert main"
                        style={`aspect-ratio: ${advert.mainPicture.object.width} / ${advert.mainPicture.object.height}; ${advert.mainPicture.object.width > advert.mainPicture.object.height ? "width: 100%;" : "height: 100%;"}`}
                    />
                </div>
                <div class="data">
                    <h2>{advert.title}</h2>
                    <p>{data.filters.states.find(i => i.id == advert.stateId)?.name}</p>
                    <div class="flex-spacer"></div>
                    <h3>{advert.priceHuf} HUF</h3>
                    <h3>{advert.location.name}</h3>
                </div>
            </a>
        {/each}
        {#if loadingAdverts}
            <div id="loading-container">
                <h2>Betöltés...</h2>
            </div>
        {/if}
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

                &.models-group .checkboxgroup {
                    padding-left: 1rem;
                }

                .manufacturer-title {
                    display: flex;
                    flex-direction: row;
                    justify-content: start;
                    align-items: center;
                    gap: 0.5rem;
                    p {
                        font-weight: bold;
                    }
                    hr {
                        flex: 1;
                    }
                }
            }

            .checkboxgroup {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }
        }

        #advert-container {
            display: grid;
            grid-template-columns: repeat(5, 19%);
            grid-template-rows: repeat(auto-fill, 20rem);
            padding: 1rem;
            gap: 1rem;

            .no-adverts {
                grid-column: span 5;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
                font-weight: bold;
            }

            #loading-container {
                grid-column: span 5;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .advert {
                display: grid;
                color: $color-black;
                text-decoration: none;
                grid-template-rows: 1fr 1fr;
                width: 100%;
                padding: 1rem;
                border-radius: 0.3rem;
                height: 100%;
                // border: 1px solid $color-black;
                background-color: $color-white;
                box-shadow: 1px 1px 5px 0px $color-black;

                .data {
                    padding: 5px;
                    display: flex;
                    flex-direction: column;
                }

                .flex-spacer {
                    width: 100%;
                    flex: 1;
                }

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
            }
        }

        .checkboxgroup {
            display: flex;
            flex-direction: column;
        }
    }
</style>

<script lang="ts">
    import apiPath from "$lib/apiPath";
    import type { LocalAdvert, Location, Model, Picture } from "$lib/types";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { afterNavigate, goto, invalidate, invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import noImage from "$lib/images/noImage";
    import LocationSearch from "$lib/components/LocationSearch.svelte";
    import bars from "$lib/images/bars.svg";

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
            let models: { [key: string]: CheckBoxModel[] } = {};
            for (const key in modelGroups) {
                if (key !== manufacturerId) {
                    models[key] = modelGroups[key];
                }
            }
            modelGroups = models;
        }
    }

    onMount(async () => {
        // console.log(userId);
        filtersHidden = undefined;
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
        // console.log($page.url);
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
            // console.log("submit", userId);
            searchForm.requestSubmit();
        }, 1500);
    }

    let loadingAdverts = false;

    async function loadMoreAdverts() {
        if (data.advertCount == undefined || adverts.length >= data.advertCount) {
            return;
        }
        // console.log("loading more adverts", adverts.length);
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

    let selectedLocation: Location | undefined = data.activeFilters.location;
    let locationSearch: any;
    let distanceValue = data.activeFilters.distance;

    function clearLocation() {
        selectedLocation = undefined;
        distanceValue = 0;
        locationSearch.clear();
        changeSearch();
    }

    function changeSlider() {
        if (selectedLocation === undefined) {
            return;
        }
        changeSearch();
    }

    let filtersHidden: boolean | undefined = undefined;

    function hamburgerClick() {
        if (filtersHidden === undefined) {
            filtersHidden = false;
        } else {
            filtersHidden = !filtersHidden;
        }
    }

    let filterClass: string;

    $: {
        if (filtersHidden === undefined) {
            filterClass = "default";
        } else if (filtersHidden) {
            filterClass = "slide-out";
        } else {
            filterClass = "slide-in";
        }
    }

    afterNavigate(() => {
        invalidateAll();
        // filtersHidden = undefined;
        if ($page.url.pathname.search("/profile/") !== -1) {
            userId = $page.data.user.id;
        } else {
            userId = undefined;
        }
        // console.log(userId);
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
    console.log(data.ownUser);
</script>

<slot></slot>
<div class="main-container">
    <form
        class={filterClass}
        id="filter-container"
        method="post"
        action="/search?/filters"
        bind:this={searchForm}
        use:enhance={({ formData }) => {
            formData.append("location", selectedLocation?.id.toString() ?? "");
        }}
    >
        <!-- <div class="filter-group"><button id="search" type="submit">Keresés</button></div> -->
        <input type="text" name="title" id="title" class="hidden" value={data.activeFilters.title} />
        <input type="text" name="sortBy" id="sortBy" class="hidden" value={data.activeFilters.sortBy} />
        <input type="text" name="sortOrder" id="sortOrder" class="hidden" value={data.activeFilters.sortOrder} />
        <input type="text" name="userId" id="userId" class="hidden" bind:value={userId} />
        <div id="title" class="filter-group">
            <div class="title-row">
                <h2>Szűrés</h2>
                <button on:click|preventDefault={hamburgerClick}>&times;</button>
            </div>
        </div>
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
        <div id="location" class="filter-group">
            <div class="title-row">
                <h2>Hely</h2>
                <button on:click|preventDefault={clearLocation}>&#128465;</button>
            </div>
            <hr />
            <label for="distance">Max távolság: {distanceValue}km</label>
            <input
                type="range"
                name="distance"
                id="distance"
                min="0"
                max="250"
                bind:value={distanceValue}
                on:change={changeSlider}
            />
            <LocationSearch bind:selectedLocation bind:this={locationSearch} on:search={changeSearch} />
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
                        data-manufacturerId={manufacturer.id}
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
        <button id="open-menu-btn" style={`background-image: url(${bars});`} on:click={hamburgerClick}></button>
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
    <div id="advert-container" class={filtersHidden !== undefined && !filtersHidden ? "hidden" : ""}>
        {#if adverts.length == 0}
            <div class="no-adverts">Nincs találat</div>
        {/if}
        {#each adverts as advert, index}
            <a href={`/advert/${advert.id}`} class="advert" title={advert.title}>
                <div
                    class="image"
                    style={`background-image: url('data:image/jpeg;base64,${advert.mainPicture.data}');`}
                >
                    <!-- <img
                        src={`data:image/jpeg;base64,${advert.mainPicture.data}`}
                        alt="advert main"
                        style={`aspect-ratio: ${advert.mainPicture.object.width} / ${advert.mainPicture.object.height}; ${advert.mainPicture.object.width > advert.mainPicture.object.height ? "width: 100%;" : "height: 100%;"}`}
                    /> -->
                </div>
                <div class="data">
                    <h2>{advert.title.substring(0, 25)}{advert.title.length > 25 ? "..." : ""}</h2>
                    <p>{data.filters.states.find(i => i.id == advert.stateId)?.name}</p>
                    <div class="flex-spacer"></div>
                    <h3>{advert.priceHuf} HUF</h3>
                    <h3>{advert.location.name}</h3>
                </div>
                {#if index == adverts.length - 6}
                    <IntersectionObserver on:intersect={loadMoreAdverts} />
                {/if}
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
        position: relative;

        .hidden {
            display: none !important;
        }

        #sorting-container {
            display: flex;
            justify-content: end;
            align-items: center;
            padding-right: 1rem;
            padding-left: 1rem;

            @include mobile {
                grid-column: 1 / span 2;
                justify-content: space-between;
            }

            #open-menu-btn {
                background-color: $color-white;
                border: none;
                cursor: pointer;
                padding: 0.2rem;
                border-radius: 0.2rem;
                aspect-ratio: 1 / 1;
                height: 100%;
                background-position: center;
                background-size: 70%;
                background-repeat: no-repeat;

                display: none;

                @include mobile {
                    display: block;
                }

                &:hover {
                    box-shadow: 2px 2px 5px $color-black;
                }

                &:active {
                    transform: scale(0.9);
                    // box-shadow: 1px 1px 5px $color-black inset;
                    box-shadow: none;
                    outline: 1px solid black;
                }
            }

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
            transition: transform 0.5s ease;

            @keyframes slideIn {
                0% {
                    display: none;
                }
                1% {
                    display: flex;
                }
                2% {
                    transform: translateX(-101%);
                }
                100% {
                    transform: translateX(0);
                }
            }

            @keyframes slideOut {
                0% {
                    transform: translateX(0);
                }
                98% {
                    transform: translateX(-101%);
                }
                99% {
                    display: none;
                }
                100% {
                    display: none;
                }
            }

            @keyframes hideWhileSliding {
                0% {
                    visibility: hidden;
                }
                98% {
                    visibility: hidden;
                }
                100% {
                    visibility: visible;
                }
            }

            @include mobile {
                grid-row: auto;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                background-color: darken($color-white, 10%);
                min-height: 100%;

                &.default {
                    transform: translateX(-101%);
                    display: none;
                }

                &.slide-in {
                    animation: slideIn 0.5s ease forwards;
                }

                &.slide-out {
                    animation: slideOut 0.5s ease forwards;
                }

                // transform: translateX(-101%);
                // display: none;
            }

            // Last .filter-group
            .filter-group:last-child {
                margin-bottom: 1rem;
            }

            .filter-group {
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
                background-color: $color-white;
                border-radius: 0.3rem;
                box-shadow: 1px 1px 5px 0px $color-black;
                padding: 0.5rem;

                &#title {
                    button {
                        color: $color-dark-blue;
                        display: none;
                        @include mobile {
                            display: flex;
                        }
                    }
                }

                .title-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }

                button {
                    background-color: $color-white;
                    border: none;
                    cursor: pointer;
                    padding: 0.2rem;
                    border-radius: 0.2rem;
                    aspect-ratio: 1 / 1;
                    font-size: 1.5rem;
                    color: $color-red;
                    font-weight: 600;

                    &:hover {
                        text-shadow: 1px 1px 5px $color-black;
                    }

                    &:active {
                        transform: scale(0.9);
                        text-shadow: none;
                    }
                }

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

        // TODO padding bigger on right than left, center align whole list
        #advert-container {
            display: flex;
            // grid-template-columns: repeat(5, 19%);
            // grid-template-rows: repeat(auto-fill, 20rem);
            padding: 0.9rem;
            gap: 0.9rem;
            flex-wrap: wrap;

            @include tablet {
                flex-direction: column;
            }

            @include tablet {
                grid-template-columns: 1fr;
            }

            @include mobile {
                grid-column: 1 / span 2;
            }

            .no-adverts {
                grid-column: span 5;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
                font-weight: bold;
                width: 100%;
            }

            #loading-container {
                grid-column: span 5;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .advert {
                display: flex;
                flex-direction: column;
                color: $color-black;
                text-decoration: none;
                // grid-template-rows: 1fr 1fr;
                width: 19%;
                padding: 1rem;
                border-radius: 0.3rem;
                height: 20rem;
                // border: 1px solid $color-black;
                background-color: $color-white;
                box-shadow: 1px 1px 5px 0px $color-black;
                word-break: break-word;

                @include tablet {
                    width: 100%;
                }

                .data {
                    padding: 5px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;

                    @include tablet {
                        flex: 1;
                    }

                    h2 {
                        font-size: 120%;
                    }
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
                    flex: 0.8;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-color: darken($color-white, 10%);

                    @include tablet {
                        flex: 2;
                    }
                }
            }
        }

        .checkboxgroup {
            display: flex;
            flex-direction: column;
        }
    }
</style>

<script lang="ts">
    import apiPath from "$lib/apiPath";
    import type { LocalAdvert, Model, Picture } from "$lib/types";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { afterNavigate, invalidate, invalidateAll } from "$app/navigation";
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
    console.log(data);

    let userId: number | undefined = undefined;

    if ($page.url.pathname.search("/profile/") !== -1) {
        userId = $page.data.user.id;
    }

    let adverts: ExtendedAdvert[] = [];
    let cutAdverts: ExtendedAdvert[] = [];

    let models: CheckBoxModel[] = [];

    async function getModels(manufacturerId: number) {
        const resp = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${manufacturerId}`);
        let data = await resp.json();
        data = data.map((model: Model) => {
            return {
                ...model,
                checked: true
            };
        });
        models = [...models, ...data];
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
        cutAdverts = adverts;
        if (userId !== undefined) {
            cutAdverts = cutAdverts.filter(e => e.ownerId === userId);
        }
    });

    afterNavigate(() => {
        invalidateAll();
        if ($page.url.pathname.search("/profile/") !== -1) {
            userId = $page.data.user.id;
        } else {
            userId = undefined;
        }
        if (userId !== undefined) {
            cutAdverts = adverts.filter(e => e.ownerId === userId);
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
        cutAdverts = adverts;
        if (userId !== undefined) {
            cutAdverts = cutAdverts.filter(e => e.ownerId === userId);
        }
    });
</script>

<slot></slot>
<div class="main-container">
    <form id="filter-container" method="post" action="/search?/filters">
        <button id="search" type="submit">Keresés</button>
        <input type="text" name="title" id="title" class="hidden" value={data.activeFilters.title} />
        <div id="state" class="checkboxgroup">
            {#each data.filters.states as state}
                <div>
                    <label for={"states" + state.id}>{state.name}</label>
                    <input
                        type="checkbox"
                        name="state"
                        id={"states" + state.id}
                        value={state.id}
                        checked={data.activeFilters.states.includes(state.id)}
                    />
                </div>
            {/each}
        </div>
        <div id="manufacturer" class="checkboxgroup">
            {#each data.filters.manufacturers as manufacturer}
                <div>
                    <label for={"manufacturers" + manufacturer.id}>{manufacturer.name}</label>
                    <input
                        type="checkbox"
                        name="manufacturer"
                        id={"manufacturers" + manufacturer.id}
                        value={manufacturer.id}
                        checked={data.activeFilters.manufacturers.includes(manufacturer.id)}
                        on:change={onManufacturerSelect}
                    />
                </div>
            {/each}
        </div>
        <div id="model" class="checkboxgroup">
            {#each models as model}
                <div>
                    <label for={"models" + model.id}>{model.name}</label>
                    <input
                        type="checkbox"
                        name="model"
                        id={"models" + model.id}
                        value={model.id}
                        checked={data.activeFilters.models.includes(model.id) || model.checked}
                    />
                </div>
            {/each}
        </div>
    </form>
    <div id="sorting-container"></div>
    <div id="advert-container">
        <!-- TODO wait for backend picture handling -->
        <!-- {data?.adverts?.length} -->
        {#each cutAdverts as advert}
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
        display: flex;
        display: grid;
        grid-template-columns: 3fr 17fr;
        grid-template-rows: 1fr 15fr;

        .hidden {
            display: none;
        }

        #filter-container {
            grid-row: span 2;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #advert-container {
            display: grid;
            grid-template-columns: repeat(4, 18rem);
            grid-template-rows: repeat(auto-fill, 20rem);
            padding: 1rem;
            gap: 1rem;
            .advert {
                display: grid;
                grid-template-rows: 1fr 1fr;
                width: 100%;
                padding: 1rem;
                border-radius: 0.6rem;
                height: 100%;
                border: 1px solid $color-black;

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

        div {
            border: 1px solid black;
        }

        .checkboxgroup {
            display: flex;
            flex-direction: column;
        }
    }
</style>

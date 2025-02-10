<script lang="ts">
    import { enhance } from "$app/forms";
    import arrayBufferToBase64 from "$lib/arrayBufferToBase64";
    import { onMount } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import apiPath from "$lib/apiPath";
    import type { Location, Model } from "$lib/types/";
    import { base } from "$app/paths";
    import LocationSearch from "$lib/components/LocationSearch.svelte";
    import { goto } from "$app/navigation";
    import { Buffer } from "buffer";

    export let data: PageData;

    let models: Model[];

    let brandId: number = 0;

    let imageFiles: { base64: string; aspect: string }[] = [];

    let mainPicture: number = 0;

    let descValue: string = "";

    let formLoading: boolean = false;

    async function handleFiles(event: Event | DragEvent) {
        event.preventDefault();

        const target = event.target as HTMLInputElement;

        let eventFiles: FileList | null | undefined;

        if (event instanceof DragEvent) {
            eventFiles = event.dataTransfer?.files;
        } else {
            eventFiles = target.files;
        }

        if (!eventFiles) return;

        for (const file of eventFiles) {
            if (file.size > 50000000) {
                alert("Valamely fájlok mérete túl nagy!");
                return;
            }
        }

        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles[i] as File;
            const base64 = await file.arrayBuffer().then(buffer => Buffer.from(buffer).toString("base64"));
            const image = new Image();
            image.src = "data:image/jpeg;base64," + base64;
            image.onload = () => {
                let localFiles = [];
                localFiles.push({ base64, aspect: `${image.width} / ${image.height}` });
                imageFiles = [...imageFiles, ...localFiles];
                console.log(imageFiles);
            };
        }
        target.files = null;
    }

    async function manufacturerSelect() {
        const res = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${brandId}`);
        const data = await res.json();
        models = data;
    }

    function checkboxChange(index: number) {
        if (mainPicture !== index) {
            mainPicture = index;
        }
    }

    function deleteImage(index: number) {
        imageFiles = imageFiles.filter((_, i) => i !== index);
    }

    function resetForm() {
        imageFiles = [];
        mainPicture = 0;
        descValue = "";
        selectedLocation = undefined;
        locationSearch.clear();
        priceValue = 0;
        brandId = 0;
        selectedModel = 0;
        selectedState = 0;
        advertTitle = "";
        locationError = false;
    }

    let selectedLocation: Location | undefined = undefined;
    let locationSearch: any;
    let locationError: boolean = false;
    let selectedModel: number = 0;
    let selectedState: number = 0;
    let advertTitle: string = "";
    let priceError: boolean = false;

    let priceValue = 0;

    async function imageDrop(e: DragEvent) {
        e.preventDefault();

        const target = e.target as HTMLInputElement;

        let eventFiles: FileList | null | undefined;

        if (e instanceof DragEvent) {
            eventFiles = e.dataTransfer?.files;
        } else {
            eventFiles = target.files;
        }

        if (!eventFiles) return;

        for (const file of eventFiles) {
            if (file.size > 50000000) {
                alert("Valamely fájlok mérete túl nagy!");
                return;
            }
        }

        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles[i] as File;
            const base64 = await file.arrayBuffer().then(buffer => Buffer.from(buffer).toString("base64"));
            const image = new Image();
            image.src = "data:image/jpeg;base64," + base64;
            image.onload = () => {
                let localFiles = [];
                localFiles.push({ base64, aspect: `${image.width} / ${image.height}` });
                imageFiles = [...imageFiles, ...localFiles];
                console.log(imageFiles);
            };
        }
        target.files = null;
    }

    let timeout: NodeJS.Timeout;
    let isHovering = false;

    function imageDragOver(e: DragEvent) {
        isHovering = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            isHovering = false;
        }, 1000);
    }

    function imageDescChange(e: Event) {
        if (!e?.target) return;
        if ((e.target as HTMLInputElement).value.length > 100) {
            (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(0, 100);
        }
    }

    let pictureInput: HTMLInputElement;
</script>

<!-- TODO new description editor -->

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form
    action="?/submit"
    method="post"
    use:enhance={({ formData, cancel }) => {
        console.log(priceValue);
        if (priceValue <= 0) {
            priceError = true;
            return cancel();
        }
        priceError = false;
        formLoading = true;
        for (const key in imageFiles) {
            formData.append("filelist", imageFiles[key].base64);
        }
        formData.append("mainPictureIndex", mainPicture.toString());
        if (!selectedLocation) {
            formLoading = false;
            locationError = true;
            cancel();
        }
        if (selectedLocation) formData.append("locationId", selectedLocation.id.toString());
        return async ({ update }) => {
            formLoading = false;
            await update();
            imageFiles = [];
        };
    }}
    enctype="multipart/form-data"
    id="main-content-container"
>
    {#if formLoading}
        <div id="loadingcover">
            <h1>Létrehozás...</h1>
            <div class="spinner">
                <div class="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    {/if}
    <div id="main-content">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            id="picture-container"
            class={isHovering ? "image-hover" : ""}
            on:dragover|preventDefault={imageDragOver}
            on:drop|preventDefault={imageDrop}
        >
            {#if isHovering}
                <div class="hover-text-container">
                    <h2 class="hover-text">Fájl feltöltése</h2>
                </div>
            {/if}
            <h3>Képek</h3>
            <div class="file-input">
                <button type="button" id="button" on:click={() => pictureInput.click()}>
                    <span>+</span>
                </button>
                <input
                    type="file"
                    class="hidden"
                    name="test"
                    id="test"
                    accept=".jpg,.png,.webp,.gif,.avif"
                    multiple
                    on:change={handleFiles}
                    bind:this={pictureInput}
                />
            </div>
            <div class="images">
                {#each imageFiles as image, index}
                    <div class="image">
                        <label class="checkbox-container" for={`image${index}primary`} title="Fő kép">
                            <input
                                type="radio"
                                name={`image${index}primary`}
                                id={`image${index}primary`}
                                checked={mainPicture === index}
                                value={index}
                                on:change={() => {
                                    checkboxChange(index);
                                }}
                            />
                            <span class="checkmark"></span>
                        </label>
                        <button
                            class="delete"
                            on:click|preventDefault={() => {
                                deleteImage(index);
                            }}>&times;</button
                        >
                        <img
                            src={`data:image/jpeg;base64,${image.base64}`}
                            alt="uploaded"
                            style={`aspect-ratio: ${image.aspect};`}
                        />
                        <textarea
                            maxlength="100"
                            name={`image${index}desc`}
                            id={`image${index}desc`}
                            placeholder="Leaírás..."
                            on:change={imageDescChange}
                        ></textarea>
                    </div>
                {/each}
            </div>
        </div>
        <div id="main-data-container">
            <div class="row">
                <div class="group">
                    <label for="title">Cím:</label>
                    <input
                        type="text"
                        aria-multiline="true"
                        name="title"
                        id="title"
                        placeholder="Cím"
                        required
                        bind:value={advertTitle}
                    />
                </div>
            </div>
            <div class="row">
                <div class="group">
                    <label for="manufacturer">Gyártó:</label>
                    <select required bind:value={brandId} name="brandId" id="brandId" on:change={manufacturerSelect}>
                        {#each data.filters.manufacturers as manufacturer}
                            <option value={manufacturer.id}>{manufacturer.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="group">
                    <label for="price">Ár:</label>
                    <input
                        type="number"
                        name="priceHuf"
                        id="priceHuf"
                        placeholder="Ár"
                        required
                        bind:value={priceValue}
                        on:change={() => {
                            if (priceValue < 0) priceValue = 0;
                            if (priceValue > 10000000) priceValue = 10000000;
                        }}
                    />
                </div>
            </div>
            <div class="row">
                <div class="group">
                    <label for="model">Modell:</label>
                    <select required name="modelId" id="modelId" bind:value={selectedModel}>
                        {#each models || [] as model}
                            <option value={model.id}>{model.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="group">
                    <label for="state">Állapot:</label>
                    <select required name="stateId" id="stateId" bind:value={selectedState}>
                        {#each data.filters.states as state}
                            <option value={state.id}>{state.name}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="group">
                    <div class="locationSeach-container">
                        <LocationSearch error={locationError} bind:selectedLocation bind:this={locationSearch} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="description-container">
        <textarea bind:value={descValue} name="description" id="description" required placeholder="Leírás"></textarea>
    </div>
    <div id="button-container">
        <button on:click|preventDefault={resetForm} class="reset-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="aspect-ratio: 448 / 512;"
                ><path
                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                /></svg
            >
        </button>
        <button type="submit">Létrehozás</button>
    </div>
</form>

<style lang="scss">
    @import "$lib/styles/variables";

    .hidden {
        display: none;
    }

    #loadingcover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1 {
            color: $color-white;
            font-size: 2rem;
        }

        .spinner {
            .lds-facebook {
                color: $color-white;
            }
            .lds-facebook,
            .lds-facebook div {
                box-sizing: border-box;
            }
            .lds-facebook {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }
            .lds-facebook div {
                display: inline-block;
                position: absolute;
                left: 8px;
                width: 16px;
                background: currentColor;
                animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
            }
            .lds-facebook div:nth-child(1) {
                left: 8px;
                animation-delay: -0.24s;
            }
            .lds-facebook div:nth-child(2) {
                left: 32px;
                animation-delay: -0.12s;
            }
            .lds-facebook div:nth-child(3) {
                left: 56px;
                animation-delay: 0s;
            }
            @keyframes lds-facebook {
                0% {
                    top: 8px;
                    height: 64px;
                }
                50%,
                100% {
                    top: 24px;
                    height: 32px;
                }
            }
        }
    }

    #main-content-container {
        display: flex;
        // grid-template-rows: 40% 60%;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        min-height: 100%;
        padding-top: 1rem;
        padding-left: 6rem;
        padding-right: 6rem;
        padding-bottom: 1rem;
        gap: 1rem;
        height: 100%;
        flex: 1;

        #main-content {
            height: 25rem;
            display: flex;
            gap: 1rem;

            #picture-container {
                border: 1px solid black;
                border-radius: 10px;
                background-color: $color-white;
                box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
                flex: 1;
                // background-color: rgb(20, 83, 62);
                position: relative;

                display: flex;
                flex-direction: column;
                align-items: stretch;
                padding: 0.5rem;
                gap: 0.5rem;
                overflow-y: auto;

                &.image-hover {
                    border: 2px dashed $color-dark-blue;
                }

                .hover-text-container {
                    border-radius: 10px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba($color-black, 0.5);

                    .hover-text {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 2rem;
                        color: $color-white;
                        font-weight: bold;
                    }
                }

                .images {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    padding: 0.5rem;
                    gap: 0.5rem;
                    flex-grow: 1;
                    overflow-y: scroll;
                    max-height: 100%;
                    width: 100%;
                }

                .image {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 0.2rem;
                    border: 1px solid $color-dark-blue;
                    border-radius: 10px;

                    textarea {
                        resize: none;
                        width: 100%;
                        display: block;
                        padding: 0;
                        margin: 0;
                        border: 1px solid $color-dark-blue;
                        padding: 0.2rem;
                    }

                    img {
                        width: 100%;
                    }

                    .delete {
                        position: absolute;
                        top: 0.3rem;
                        right: 0.5rem;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: red;
                        font-size: 1.5rem;
                    }

                    .checkbox-container {
                        display: flex;
                        gap: 0.1rem;
                        position: absolute;
                        top: 0.3rem;
                        left: 0.3rem;
                        cursor: pointer;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        color: $color-white;
                    }

                    .checkbox-container input {
                        opacity: 0;
                        cursor: pointer;
                        height: 0;
                        width: 0;
                    }

                    .checkmark {
                        position: relative;
                        border-radius: 5px;
                        border: 1px solid $color-dark-blue;
                        display: block;
                        z-index: 2;
                        top: 0;
                        left: 0;
                        height: 25px;
                        width: 25px;
                        background-color: $color-white;
                    }

                    .checkbox-container:hover input ~ .checkmark {
                        background-color: darken($color-white, 20%);
                    }

                    .checkbox-container input:checked ~ .checkmark {
                        background-color: #2196f3;
                    }

                    .checkbox-container .checkmark:after {
                        left: 50%;
                        transform-origin: center;
                        top: 50%;
                        width: 5px;
                        height: 10px;
                        border: solid white;
                        border-width: 0 3px 3px 0;
                        transform: translate(-50%, -50%) rotate(45deg);
                        transition: opacity 0.2s ease;
                    }

                    .checkmark:after {
                        content: "";
                        position: absolute;
                        opacity: 0;
                    }

                    .checkbox-container input:checked ~ .checkmark:after {
                        opacity: 1;
                    }
                }

                .file-input {
                    position: relative;

                    #button {
                        position: relative;
                        background-color: $color-blue;
                        display: grid;
                        place-items: center;
                        width: 100%;
                        padding: 0.2rem;
                        font-size: 1.5rem;
                        color: $color-white;
                        border-radius: 7px;
                        cursor: pointer;

                        &:hover {
                            background-color: lighten($color-blue, 5%);
                        }

                        &:active {
                            background-color: darken($color-blue, 5%);
                        }
                    }

                    /* input {
                        visibility: hidden;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border: 1px solid red;
                        cursor: pointer;
                        z-index: 2;

                        &:hover::before {
                            content: "";
                            background-color: rgba(0, 0, 0, 0.5);
                        }

                        &::before {
                            content: "";
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            visibility: visible;
                            display: grid;
                            place-items: center;
                            color: $color-white;
                            cursor: pointer;
                        }
                    } */
                }
            }

            #main-data-container {
                border: 1px solid $color-black;
                border-radius: 10px;
                box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
                background-color: $color-white;
                flex: 3;
                padding: 1rem;
                gap: 1rem;
                color: $color-black;
                display: flex;
                flex-direction: column;
                align-items: stretch;

                .row {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    justify-content: end;

                    .group {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex: 1;

                        // #title {
                        //     width: 100%;
                        // }

                        &:has(> .locationSeach-container) {
                            justify-content: center;
                        }

                        .locationSeach-container {
                            width: 50%;
                        }
                    }
                }

                label {
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                input,
                select {
                    font-size: 1.8rem;
                    padding: 0.1rem;
                    font-weight: bold;
                    background-color: transparent;
                    text-align: right;
                    width: 100%;

                    &.error {
                        border: 1px solid $color-red;
                        outline: 1px solid $color-red;
                    }
                }
            }
        }

        #description-container {
            border: 1px solid $color-black;
            border-radius: 10px;
            box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
            background-color: $color-white;
            flex: 5;
            padding: 1rem;
            gap: 1rem;
            width: 100%;
            color: $color-black;
        }

        #button-container {
            border: 1px solid $color-black;
            border-radius: 10px;
            box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
            background-color: $color-white;
            height: 3.5rem;
            gap: 1rem;
            color: $color-black;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 1rem;
            padding-left: 1rem;

            .reset-button {
                display: grid;
                place-items: center;
                fill: red;
                padding: 6px;
                background: none;

                aspect-ratio: 1 / 1;
                height: 70%;

                &:hover {
                    background-color: rgba(255, 0, 0, 0.1);
                }

                svg {
                    height: 100%;
                    width: 100%;
                }
            }

            button {
                padding: 0.5rem 1rem;
                border-radius: 0.3rem;
                border: none;
                background-color: $color-blue;
                color: $color-white;
                font-size: 1.1rem;
                cursor: pointer;

                &:hover {
                    background-color: darken($color-blue, 10%);
                }
            }
        }
    }
</style>

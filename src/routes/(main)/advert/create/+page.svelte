<script lang="ts">
    import { enhance } from "$app/forms";
    import arrayBufferToBase64 from "$lib/arrayBufferToBase64";
    import { onMount } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import apiPath from "$lib/apiPath";
    import type { Model } from "$lib/types/";
    import { base } from "$app/paths";

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

        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles[i] as File;
            const base64 = await file.arrayBuffer().then(buffer => arrayBufferToBase64(buffer));
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
</script>

<div id="main-content">
    {#if formLoading}
        <div id="loadingcover"></div>
    {/if}
    <h1>Hirdetés létrehozása</h1>
    <form
        action="?/submit"
        method="post"
        use:enhance={({ formData, cancel }) => {
            formLoading = true;
            for (const key in imageFiles) {
                formData.append("filelist", imageFiles[key].base64);
            }
            formData.append("mainPictureIndex", mainPicture.toString());
            return async ({ update }) => {
                formLoading = false;
                update();
                imageFiles = [];
                /*TODO redirect to advert*/
            };
        }}
        enctype="multipart/form-data"
        id="main-form"
    >
        <div class="left-side">
            <div class="input-group" id="title-group">
                <label for="title">Cím:</label>
                <input type="text" aria-multiline="true" name="title" id="title" placeholder="Cím" required />
            </div>
            <div class="input-group" id="description-group">
                <div class="label">
                    <label for="description">Leírás:</label>
                    <div class="charcount">
                        <span>{descValue.length}</span>
                        <span>/</span>
                        <span>1000</span>
                    </div>
                </div>
                <textarea bind:value={descValue} name="description" id="description" required placeholder="Leírás"
                ></textarea>
            </div>
            <div class="input-group" id="location-group">
                <label for="locationId">Település:</label>
                <select name="locationId" id="locationId" required>
                    <option value="1614">Kiskunfélegyháza</option>
                </select>
            </div>
            <div class="input-group" id="price-group">
                <label for="priceHuf">Ár:</label>
                <input name="priceHuf" type="number" placeholder="0" id="priceHuf" required />
            </div>
            <div class="input-group" id="state-group">
                <label for="stateId">Állapot:</label>
                <select name="stateId" id="stateId" required>
                    {#each data.filters.states as state}
                        <option value={state.id}>{state.name}</option>
                    {/each}
                </select>
            </div>
            <div class="input-group" id="manufacturer-group">
                <label for="brandId">Gyártó:</label>
                <select required bind:value={brandId} name="brandId" id="brandId" on:change={manufacturerSelect}>
                    {#each data.filters.manufacturers as manufacturer}
                        <option value={manufacturer.id}>{manufacturer.name}</option>
                    {/each}
                </select>
            </div>
            <div class="input-group" id="model-group">
                <label for="modelId">Modell:</label>
                <select required name="modelId" id="modelId">
                    {#each models || [] as model}
                        <option value={model.id}>{model.name}</option>
                    {/each}
                </select>
            </div>
            <div class="input-group" id="revision-group">
                <label for="revision">Revízió:</label>
                <input name="revision" type="text" id="revision" placeholder="Revízio" />
            </div>
        </div>

        <div class="right-side">
            <!-- <img
            src="https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="a"
            />
            <img
            src="https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="a"
            /> -->
            <div class="file-input">
                <div id="button">
                    <span>+</span>
                    <input
                        type="file"
                        name="test"
                        id="test"
                        accept=".jpg,.png,.webp,.gif,.avif"
                        multiple
                        on:change={handleFiles}
                    />
                </div>
            </div>
            <div class="images">
                <!-- TODO height bug -->
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
                        <img
                            src={`data:image/jpeg;base64,${image.base64}`}
                            alt="uploaded"
                            style={`aspect-ratio: ${image.aspect};`}
                        />
                        <textarea name={`image${index}desc`} id={`image${index}desc`} placeholder="Leaírás..."
                        ></textarea>
                    </div>
                {/each}
            </div>
        </div>
        <div class="submit-row"><button type="submit">Létrehozás</button></div>
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/variables";

    #main-content {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    #loadingcover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    #main-form {
        $backround: darken($color-white, 3%);

        display: grid;
        grid-template-rows: 1fr 10%;
        grid-template-columns: 1fr 1fr;
        height: 85%;
        gap: 1rem;
        width: 50%;
        background-color: $backround;
        border-radius: 1rem;
        border: 1px solid $color-dark-blue;
        box-shadow: 2px 2px 3px $color-black;

        .submit-row {
            grid-column: span 2;
            background-color: darken($backround, 5%);
            border-radius: 0 0 1rem 1rem;
            display: flex;
            align-items: center;
            justify-content: end;
            padding-right: 1rem;

            button {
                padding: 0.5rem 1rem;
                border-radius: 0.3rem;
                border: none;
                background-color: $color-blue;
                color: $color-white;
                font-size: 1.1rem;
                cursor: pointer;
            }
        }

        .right-side {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0.5rem;
            gap: 0.5rem;
            overflow-y: auto;

            .images {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                padding: 0.5rem;
                gap: 0.5rem;
                flex-grow: 1;
                overflow-y: auto;
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

                /* Hide the browser's default checkbox */
                .checkbox-container input {
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                /* Create a custom checkbox */
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
                }

                input {
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
                }
            }
        }

        .left-side {
            // display: flex;
            // flex-direction: column;
            // align-items: center;
            // justify-content: center;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(6, 1fr);
            height: 100%;
            padding: 0.5rem;
            gap: 10px;

            #title-group,
            #description-group,
            #location-group {
                grid-column: span 2;
            }

            #description-group .label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                .charcount {
                    display: flex;
                    gap: 0.2rem;
                }
            }

            .input-group {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                width: 100%;

                font-size: 1.2rem;

                input,
                select,
                textarea {
                    font-size: 1.1rem;
                }

                input {
                    width: 100%;
                    padding: 0.2rem;
                    border: 1px solid $color-dark-blue;
                    border-radius: 0.3rem;
                }

                select {
                    width: 100%;
                    padding: 0.2rem;
                    border: 1px solid $color-dark-blue;
                    border-radius: 0.3rem;
                }

                textarea {
                    max-width: 100%;
                    min-width: 100%;
                    max-height: 3.5rem;
                    min-height: 3.5rem;
                    resize: none;
                }
            }
        }
    }
</style>

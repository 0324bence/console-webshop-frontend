<script lang="ts">
    import { enhance } from "$app/forms";
    import arrayBufferToBase64 from "$lib/arrayBufferToBase64";
    import { onMount } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import apiPath from "$lib/apiPath";

    export let data: PageData;
    export let form: ActionData;

    let brandId: number = Number(form?.manufacturer) || 1;

    let imageFiles: string[] = [];

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
            const file = eventFiles[i];
            const base64 = await file.arrayBuffer().then(buffer => arrayBufferToBase64(buffer));
            let localFiles = [];
            localFiles.push(base64);
            imageFiles = [...imageFiles, ...localFiles];
            console.log(imageFiles);
        }
        target.files = null;
    }

    let manufacturerForm: HTMLFormElement;

    function manufacturerSelect() {
        manufacturerForm.submit();
    }

    console.log(form);

    onMount(() => {
        fetch(`${apiPath}/filters/locations?query=b`)
            .then(response => response.json())
            .then(data => console.log(data));
    });
</script>

<div id="main-content">
    <h1>Hirdetés létrehozása</h1>
    <form
        action="?/submit"
        method="post"
        use:enhance={({ formData, cancel }) => {
            for (const key in imageFiles) {
                formData.append("filelist", imageFiles[key]);
            }
            return;
        }}
        enctype="multipart/form-data"
        id="main-form"
    >
        <div class="left-side">
            <div class="input-group">
                <label for="title">Cím:</label>
                <input type="text" name="title" id="title" placeholder="Cím" required />
            </div>
            <div class="input-group">
                <label for="description">Leírás:</label>
                <textarea name="description" id="description" required placeholder="Leírás"></textarea>
            </div>
            <div class="input-group">
                <label for="locationId">Település:</label>
                <select name="locationId" id="locationId" required>
                    <option value="1614">Kiskunfélegyháza</option>
                </select>
            </div>
            <div class="input-group">
                <label for="priceHuf">Ár:</label>
                <input name="priceHuf" type="number" placeholder="0" id="priceHuf" required />
            </div>
            <div class="input-group">
                <label for="stateId">Állapot:</label>
                <select name="stateId" id="stateId" required>
                    {#each data.filters.states as state}
                        <option value={state.id}>{state.name}</option>
                    {/each}
                </select>
            </div>
            <form action="?/manufacturer" method="post" class="input-group" bind:this={manufacturerForm}>
                <label for="brandId">Gyártó:</label>
                <select required bind:value={brandId} name="brandId" id="brandId" on:change={manufacturerSelect}>
                    {#each data.filters.manufacturers as manufacturer}
                        <option value={manufacturer.id}>{manufacturer.name}</option>
                    {/each}
                </select>
            </form>
            <div class="input-group">
                <label for="modelId">Modell:</label>
                <select required name="modelId" id="modelId">
                    {#each form?.models || [] as model}
                        <option value={model.id}>{model.name}</option>
                    {/each}
                </select>
            </div>
            <div class="input-group">
                <label for="revision">Revízió:</label>
                <input name="revision" type="text" id="revision" placeholder="Revízio" />
            </div>
        </div>

        <div class="right-side">
            {#each imageFiles as image}
                <img src={"data:image/jpeg;base64," + image} alt="kép" />
            {/each}
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
        </div>
        <div class="submit-row"><button type="submit">Létrehozás</button></div>
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/variables";

    #main-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
    #main-form {
        $backround: darken($color-white, 3%);

        display: grid;
        grid-template-rows: 1fr 10%;
        grid-template-columns: 1fr 1fr;
        height: 70%;
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
            flex-wrap: wrap;

            .file-input {
                position: relative;

                #button {
                    position: relative;
                    background-color: $color-blue;
                    display: grid;
                    place-items: center;
                    width: min-content;
                    padding: 0.2rem;
                    font-size: 3rem;
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

            img {
                width: 100px;
                height: 100px;
            }
        }

        .left-side {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 10px;

            .input-group {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                width: 50%;

                font-size: 1.1rem;

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

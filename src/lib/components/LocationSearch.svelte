<script lang="ts">
    import apiPath from "$lib/apiPath";
    import type { Location } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    let showResults = false;
    let loading = false;

    let locations: Location[] = [];

    const dispatch = createEventDispatcher<{
        search: Location;
    }>();

    async function search() {
        if (textBoxValue.length === 0) {
            return;
        }
        showResults = true;
        loading = true;

        const resp = await fetch(`${apiPath}/filters/locations?query=${encodeURIComponent(textBoxValue)}`);
        locations = await resp.json();

        loading = false;
    }

    function selectLocation(location: Location) {
        textBoxValue = `${location.name}`;
        showResults = false;
        selectedLocation = location;
        dispatch("search", location);
    }
    let textBoxValue = "";
    let textBoxFocus = false;
    let selectedResult: number = -1;

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (selectedResult < locations.length - 1) {
                selectedResult++;
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (selectedResult > -1) {
                selectedResult--;
            }
        }
    };

    function focusTextBox() {
        textBoxFocus = true;
        window.addEventListener("keydown", keyDownHandler);
    }

    function blurTextBox() {
        textBoxFocus = false;
        window.removeEventListener("keydown", keyDownHandler);
    }

    export let selectedLocation: Location | undefined = undefined;

    export let label = true;

    export function hideResults() {
        showResults = false;
    }

    export function clear() {
        textBoxValue = "";
    }

    export let error = false;
</script>

<div class="container-box">
    {#if label}
        <label for="locationTextBox"
            >Település{selectedLocation !== undefined ? ` (${selectedLocation.name})` : ""}:
        </label>
    {/if}
    <form on:submit|preventDefault class="input-container">
        <input
            class={error ? "error" : ""}
            type="text"
            placeholder={selectedLocation !== undefined ? `${selectedLocation.name}...` : "Település..."}
            bind:value={textBoxValue}
            on:focus={focusTextBox}
            on:blur={blurTextBox}
            id="locationTextBox"
        />
        <button
            type={selectedResult < 0 ? "submit" : "button"}
            class={selectedResult < 0 && textBoxFocus ? "submit-btn selected" : "submit-btn"}
            disabled={loading}
            on:click={search}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                ><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                /></svg
            >
        </button>
        {#if showResults}
            <div class="results">
                {#if loading}
                    <div class="loading">
                        <span>Betöltés...</span>
                    </div>
                {:else}
                    {#if locations.length === 0}
                        <div class="loading">
                            <span>Nincs találat</span>
                        </div>
                    {/if}
                    {#each locations as location, index}
                        <button
                            class={"result " + (selectedResult === index ? "selected" : "")}
                            type={selectedResult === index ? "submit" : "button"}
                            on:click|stopPropagation={() => {
                                hideResults();
                                selectedResult = -1;
                                selectLocation(location);
                            }}
                        >
                            <h1>{location.name} ({location.zip})</h1>
                            <p>{location.county}</p>
                        </button>
                    {/each}
                {/if}
            </div>
        {/if}
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/variables";

    .container-box {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .input-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        gap: 1%;

        .input-box {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .submit-btn {
            color: $color-black;
            background-color: $color-white;
            border: 1px solid $color-black;
            border-radius: 0.2rem;
            padding: 0.2rem;
            aspect-ratio: 1 / 1;
            cursor: pointer;

            &:hover {
                background-color: darken($color-white, 5%);
            }

            &.selected {
                background-color: darken($color-white, 5%);
            }

            &:disabled {
                cursor: not-allowed;
                background-color: darken($color-white, 10%);
            }

            svg {
                height: 100%;
                width: 2rem;
                fill: $color-black;
            }
        }

        input {
            flex: 1;
            min-width: 0;
            font-size: 100%;
            padding: 0.2rem;
        }

        .error {
            border: 1px solid red;
        }

        .results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            width: 100%;
            max-height: 20rem;
            overflow-y: auto;
            background-color: darken($color-white, 1%);
            border: 1px solid $color-black;
            background-color: $color-black;
            display: flex;
            flex-direction: column;
            gap: 1px;

            .loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2rem;
                background-color: $color-white;
            }

            &::-webkit-scrollbar {
                display: none;
            }

            .result {
                display: flex;
                width: 100%;
                background-color: $color-white;
                border: none;
                flex-direction: column;
                cursor: pointer;
                padding: 2px;

                &:hover,
                &.selected {
                    background-color: darken($color-white, 5%);
                }

                h1 {
                    font-size: 150%;
                    font-weight: bold;
                }
            }
        }
    }
</style>

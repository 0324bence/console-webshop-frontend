<script lang="ts">
    let loading = false;
</script>

<form on:submit|preventDefault class="input-container">
    <input type="text" placeholder="Település..." />
    <button type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            ><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            /></svg
        >
    </button>
    <div class="results">
        <button class="result">
            <h1>Település neve (0000)</h1>
            <p>Megye</p>
        </button>
        {#each new Array(50) as _}
            <button class="result">
                <h1>Település neve (0000)</h1>
                <p>Megye</p>
            </button>
        {/each}
    </div>
</form>

<style lang="scss">
    @import "$lib/styles/variables";

    .input-container {
        position: relative;
        display: flex;
        justify-content: space-between;
        gap: 1%;

        button[type="submit"] {
            color: $color-black;
            background-color: $color-white;
            border: 1px solid $color-black;
            border-radius: 0.2rem;
            padding: 0.2rem;
            aspect-ratio: 1 / 1;
            cursor: pointer;

            svg {
                height: 2.5rem;
                width: 2.5rem;
                fill: $color-black;
            }
        }

        input {
            flex: 1;
            min-width: 0;
            font-size: 200%;
            padding: 0.2rem;
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

                &:hover {
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

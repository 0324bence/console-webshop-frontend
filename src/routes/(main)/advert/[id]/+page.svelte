<script lang="ts">
    import trash from "$lib/images/trash.svg";
    import edit from "$lib/images/edit.svg";
    import LocationSearch from "$lib/components/LocationSearch.svelte";
    export let data;

    // console.log(data);

    let selectedImage = data.advert.mainPicture;

    let priceValue = data.advert.priceHuf;
</script>

<!-- TODO comments -->
<div id="advert-content">
    <div id="main-data-container">
        <div id="pictures-container">
            <div id="preview-container">
                {#each data.advert.pictures as picture}
                    <button
                        class={`image ${picture.id == selectedImage.id ? "selected" : ""}`}
                        style={`background-image: url('data:image/jpeg;base64,${picture.data}');`}
                        on:click={() => (selectedImage = picture)}
                    ></button>
                {/each}
            </div>
            <div id="main-container">
                <div
                    class="image"
                    style={`background-image: url('data:image/jpeg;base64,${selectedImage.data}');`}
                ></div>
                <div id="description" class={data.isOwn ? "multiple" : ""}>
                    {#if data.isOwn}
                        <button id="delete" style={`background-image: url('${trash}');`}></button>
                    {/if}
                    <p>
                        {selectedImage.description}
                    </p>
                    {#if data.isOwn}
                        <button id="modify" style={`background-image: url('${edit}');`}></button>
                    {/if}
                </div>
            </div>
        </div>
        <div id="data-container">
            <div id="title-row">
                {#if data.isOwn}
                    <div id="edit-button">
                        <button style={`background-image: url('${edit}');`}></button>
                    </div>
                {/if}
                <div id="view-count" title="Megtekintések száma">
                    <span>&#128065;</span>
                    <span>{data.advert.viewCount}</span>
                </div>
                <div id="title">
                    <!-- <h1>{data.advert.title}</h1> -->
                    <input
                        type="text"
                        name="title"
                        id="title-input"
                        value={data.advert.title}
                        placeholder={data.advert.title}
                    />
                    <h3><a href={`/profile/${data.advert.ownerId}`}>{data.advert.owner.name}</a></h3>
                </div>
            </div>
            <div id="data">
                <!-- <h3>{data.filters.states.find(i => i.id == data.advert.stateId)?.name}</h3> -->
                <h3>{data.advert.location.name}</h3>
                <!-- <h2 class="price">{data.advert.priceHuf} HUF</h2> -->
                <div id="price-input">
                    <input
                        type="number"
                        name="price"
                        id="price"
                        placeholder={data.advert.priceHuf.toString()}
                        min="0"
                        max="10000000"
                        bind:value={priceValue}
                        on:change={() => {
                            if (priceValue < 0) priceValue = 0;
                            if (priceValue > 10000000) priceValue = 10000000;
                        }}
                    />
                    <h2 class="price">HUF</h2>
                </div>
            </div>
            <div id="button-row">
                <span>Létrehozva: {new Date(data.advert.createdTime).toISOString().split("T")[0]}</span>
                <div id="buttons">
                    <button>&hearts;</button>
                    <button>Kosárba</button>
                </div>
            </div>
        </div>
    </div>
    <div id="secondary-data-container">
        <div id="secondary-data">
            <div class="table">
                <!-- <div class="col"> -->
                <div class="row">
                    <div class="cell title">Gyártó</div>
                    <!-- <div class="cell">{data.advert.manufacturer.name}</div> -->
                    <div class="cell">
                        <select name="manufacturer" id="manufacturer"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="cell title">Modell</div>
                    <!-- <div class="cell">{data.advert.model.name}</div> -->
                    <div class="cell">
                        <select name="modell" id="modell"></select>
                    </div>
                </div>
                <!-- </div> -->
                <!-- <div class="col"> -->
                <div class="row">
                    <div class="cell title">Állapot</div>
                    <!-- <div class="cell">{data.filters.states.find(i => i.id == data.advert.stateId)?.name}</div> -->
                    <div class="cell">
                        <select name="state" id="state"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="cell title">Hely</div>
                    <!-- <div class="cell">{data.advert.location.name} ({data.advert.location.zip})</div> -->
                    <div class="cell">
                        <LocationSearch label={false} />
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
    <div id="description-container">
        <p>
            {data.advert.description}
        </p>
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #advert-content {
        display: flex;
        // grid-template-rows: 40% 60%;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        min-height: 100%;
        padding-left: 5rem;
        padding-right: 5rem;

        @include tablet {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        #main-data-container {
            height: 25rem;
            padding: 1rem;
            display: flex;
            gap: 1rem;

            @include mobile {
                flex-direction: column;
                height: auto;
            }

            #pictures-container {
                border: 1px solid black;
                border-radius: 10px;
                background-color: $color-white;
                box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
                flex: 1;
                display: grid;
                grid-template-columns: 1.1fr 2.9fr;
                gap: 1rem;
                // background-color: rgb(20, 83, 62);

                @include tablet {
                    grid-template-columns: 1fr;
                    grid-template-rows: 2.9fr 1.1fr;
                }

                #preview-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    overflow-y: auto;
                    height: 100%;
                    max-height: 100%;
                    min-height: 5rem;

                    @include tablet {
                        grid-column: 1;
                        grid-row: 2;
                        flex-direction: row;
                        padding: 0.4rem;

                        &::-webkit-scrollbar {
                            height: 0;
                        }
                    }

                    .image {
                        aspect-ratio: 16 / 9;
                        width: 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid $color-blue;
                        border-radius: 5px;
                        background-color: $color-black;
                        // background-color: darken($color-white, 10%);
                        cursor: pointer;

                        @include tablet {
                            width: auto;
                            height: 100%;
                        }

                        &:hover {
                            outline: 1px solid $color-blue;
                        }

                        &.selected {
                            outline: 1px solid black;
                        }
                    }
                }

                #main-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;

                    @include tablet {
                        grid-column: 1;
                        grid-row: 1;
                    }

                    #description {
                        width: 100%;
                        display: flex;
                        justify-content: center;

                        &.multiple {
                            justify-content: space-between;
                        }

                        button {
                            height: 100%;
                            aspect-ratio: 1 / 1;
                            border: none;
                            background-color: transparent;
                            background-position: center;
                            background-size: 70%;
                            background-repeat: no-repeat;
                            cursor: pointer;
                        }
                    }

                    .image {
                        width: 100%;
                        height: 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid $color-blue;
                        border-radius: 5px;
                        background-color: $color-black;
                        // background-color: darken($color-white, 10%);
                    }
                }
            }

            #data-container {
                border: 1px solid $color-black;
                border-radius: 10px;
                box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
                background-color: $color-white;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;
                padding: 1rem;
                gap: 1rem;
                color: $color-black;

                a {
                    color: inherit;
                }

                h1 {
                    font-size: 2.2rem;
                    font-weight: bold;
                }

                h2 {
                    font-size: 1.5rem;
                    font-weight: normal;
                }

                h3 {
                    font-size: 1.2rem;
                    font-weight: normal;
                }

                #title-row {
                    width: 100%;
                    display: flex;
                    justify-content: start;
                    gap: 1rem;

                    #edit-button {
                        button {
                            height: 20px;
                            width: 20px;
                            background-color: transparent;
                            border: none;
                            background-size: 80%;
                            background-repeat: no-repeat;
                            background-position: center;
                            cursor: pointer;
                            border-radius: 5px;

                            &:hover {
                                border: 1px solid $color-dark-blue;
                            }
                        }
                    }

                    #title {
                        margin-left: auto;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;

                        input {
                            font-size: 2.2rem;
                            font-weight: bold;
                            background-color: transparent;
                            text-align: right;
                            width: 100%;
                        }

                        a {
                            color: $color-dark-blue;
                        }
                    }
                }

                #data {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 1rem;

                    .price {
                        font-weight: bold;
                    }

                    #price-input {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        gap: 0.5rem;

                        input {
                            font-size: 1.8rem;
                            font-weight: bold;
                            background-color: transparent;
                            text-align: right;
                            width: 100%;
                        }
                    }
                }

                #button-row {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;

                    #buttons {
                        display: flex;
                        gap: 1rem;

                        button {
                            padding: 0.5rem 1rem;
                            border-radius: 15px;
                            border: 1px solid $color-dark-blue;
                            font-size: 1.2rem;
                            cursor: pointer;

                            &:hover {
                                background-color: $color-dark-blue;
                                color: $color-white;
                            }

                            &:active {
                                background-color: $color-dark-blue;
                                color: $color-white;
                            }
                        }
                    }
                }
            }
        }

        #secondary-data-container {
            padding: 1rem;
            #secondary-data {
                border: 1px solid $color-black;
                border-radius: 10px;
                box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
                background-color: $color-white;
                width: 100%;
                padding: 0.5rem;

                .table {
                    width: 100%;
                    height: 100%;
                    // border: 1px solid $color-black;
                    // background-color: $color-black;
                    // display: flex;

                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;

                    background-color: $color-black;

                    padding: 1px;
                    align-items: stretch;
                    gap: 1px;

                    @include mobile {
                        // flex-direction: column;
                        // gap: 1px;
                        grid-template-columns: 1fr;
                    }

                    & {
                        // flex: 1;
                        // display: flex;
                        // flex-direction: column;
                        // height: 100%;
                        // gap: 1px;

                        .row {
                            display: flex;
                            height: 100%;
                            width: 100%;
                            gap: 1px;
                            background-color: $color-black;

                            .cell {
                                width: 100%;
                                background-color: $color-white;
                                padding: 5px;
                                display: flex;
                                align-items: center;
                                // border: 1px solid $color-black;

                                select {
                                    width: 90%;
                                    padding: 5px;
                                    border: 1px solid $color-black;
                                    border-radius: 5px;
                                }

                                &.title {
                                    font-weight: bold;
                                    font-size: 1.2rem;
                                }
                            }
                        }
                    }
                }
            }
        }

        #description-container {
            padding: 1rem;
            flex-grow: 0;
            height: 60%;

            p {
                display: block;
                width: 100%;
                height: 100%;
                word-wrap: normal;
                white-space: pre-wrap;
            }
        }
    }
</style>

<script lang="ts">
    import trash from "$lib/images/trash.svg";
    //Testing
    import nincskep from "$lib/images/nincs-kep-fekvo.png";
    import placeholder from "$lib/images/placeholder.png";

    export let data;
</script>

<div id="cart-container">
    <div id="advert-list">
        {#each data.adverts as advert}
            <div class="advert">
                <div class="owner-container">
                    <div
                        class="profile-picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.owner.picture}')`}
                    ></div>
                    <a href={`/profile/${advert.ownerId}`}>{advert.owner.name}</a>
                </div>
                <div class="top-bar">
                    <span>{advert.location.name} ({advert.location.zip})</span>
                    <button class="delete-button" type="submit" style={`background-image: url('${trash}')`}></button>
                </div>
                <div class="picture-container">
                    <!-- svelte-ignore a11y-missing-content -->
                    <a
                        href={`/advert/${advert.id}`}
                        class="picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.mainPicture.data}')`}
                    ></a>
                </div>
                <div class="title-container">
                    <h2>{advert.title}</h2>
                </div>
                <div class="state-container">
                    <span>{data.filters.states.find(i => i.id == advert.stateId)?.name}</span>
                </div>
                <div class="bottom-bar">
                    <div class="data-container">
                        <span>{advert.manufacturer.name}</span>
                        <span>-</span>
                        <span>{advert.model.name}</span>
                    </div>
                    <h3>{advert.priceHuf} HUF</h3>
                </div>
            </div>
        {/each}
    </div>
    <div id="info-box-container">
        <div id="info-box">
            <h2>Kosár:</h2>
            <p>Termékek: <span>0</span><span>db</span></p>
            <p class="price">Összesen: <span>50000</span> <span>HUF</span></p>
            <button>Vásárlás</button>
        </div>
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #cart-container {
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: stretch;
        padding: 0 1.5rem;

        #advert-list {
            flex: 1;
            padding: 1.5rem 1.5rem;
            padding-left: 0;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;

            .advert {
                display: grid;
                grid-template-columns: 25% 75%;
                grid-template-rows: 20% 60% 20%;
                width: 100%;
                height: 18rem;
                background-color: $color-white;
                border-radius: 0.3rem;
                box-shadow: 1px 1px 5px 0px $color-black;
                padding: 1rem 1.4rem;
                // padding-left: 1.4rem;
                gap: 0.5rem;

                .owner-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;

                    a {
                        cursor: pointer;
                    }

                    .profile-picture {
                        height: 100%;
                        aspect-ratio: 1/1;
                        border-radius: 50%;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                        margin-right: 1rem;
                    }
                }

                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    button {
                        height: 60%;
                        aspect-ratio: 1/1;
                        background-size: 70%;
                        background-repeat: no-repeat;
                        background-position: center;
                        border: none;
                        cursor: pointer;
                        border-radius: 5px;
                        background-color: $color-white;
                        transition: transform 0.05s;

                        &:hover {
                            background-color: darken($color-white, 10%);
                        }

                        &:active {
                            transform: scale(0.9);
                        }
                    }
                }

                .picture-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    padding: 0.4rem;
                    padding-left: 0;

                    .picture {
                        display: block;
                        height: 100%;
                        aspect-ratio: 16/9;
                        border: 1px solid $color-black;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                        cursor: pointer;
                    }
                }

                .state-container {
                    display: flex;
                    align-items: center;
                }

                .bottom-bar {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
        }

        #info-box-container {
            width: 18%;
            height: 100%;
            padding: 1.5rem 0.5rem;
            padding-right: 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            #info-box {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
                background-color: $color-white;
                border-radius: 0.3rem;
                box-shadow: 1px 1px 5px 0px $color-black;
                padding: 0.5rem;

                h2 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    font-size: 1.2rem;
                }

                span {
                    font-weight: bold;
                }

                button {
                    width: 100%;
                    padding: 0.5rem;
                    background-color: $color-blue;
                    color: $color-white;
                    border: none;
                    border-radius: 0.3rem;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    margin-top: 2rem;

                    &:hover {
                        background-color: darken($color-blue, 10%);
                    }
                }
            }
        }
    }
</style>

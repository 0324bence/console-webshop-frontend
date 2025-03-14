<script lang="ts">
    import trash from "$lib/images/trash.svg";
    //Testing
    import nincskep from "$lib/images/nincs-kep-fekvo.png";
    import placeholder from "$lib/images/placeholder.png";
    import grayStar from "$lib/images/star_gray.svg";
    import yellowStar from "$lib/images/star_yellow.svg";
    import apiPath from "$lib/apiPath";
    import { invalidateAll } from "$app/navigation";

    export let data;

    let stars = new Array(data.adverts.length).fill(0);
    let savedStars = new Array(data.adverts.length).fill(0);

    let timeout: NodeJS.Timeout | number;
    let setable = true;

    function setStars(index: number, value: number) {
        // if (setable) stars[index] = value;
        stars[index] = value;
    }
    function setToSavedStars(index: number) {
        stars[index] = savedStars[index];
    }
    function clickStars(index: number, value: number) {
        // clearTimeout(timeout as NodeJS.Timeout);
        // setable = false;
        savedStars[index] = value;
        // timeout = setTimeout(() => {
        //     setable = true;
        // }, 500);
    }
    async function rateAdvert(index: number) {
        const req = await fetch(`${apiPath}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify({
                purchaseId: data.adverts[index].purchaseId,
                value: stars[index]
            })
        });
        if (!req.ok) {
            console.error("Error while rating advert");
            console.log(await req.json());
            return;
        }
        invalidateAll();
    }
</script>

<div id="cart-container">
    <div id="advert-list">
        <div class="title-container">
            <h2>Nem értékelt hirdetések</h2>
        </div>
        {#each data.unratedAdverts as advert, i}
            <div class="advert">
                <div class="owner-container">
                    <div
                        class="profile-picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.owner.picture}')`}
                    ></div>
                    <a href={advert.ownerId ? `/profile/${advert.ownerId}` : ""}>{advert.owner.name}</a>
                </div>
                <form method="post" action="?/deleteItem" class="top-bar">
                    <span>{advert.location.name} ({advert.location.zip})</span>
                    <input type="hidden" name="advertId" value={advert.id} />
                </form>
                <div class="picture-container">
                    <!-- svelte-ignore a11y-missing-content -->
                    <a
                        href={`/advert/${advert.id}`}
                        title={advert.title}
                        class="picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.mainPicture.data}')`}
                    ></a>
                </div>
                <div class="title-container">
                    <h2 title={advert.title}>{advert.title.substring(0, 45)}{advert.title.length > 45 ? "..." : ""}</h2>
                    <div class="row">
                        <div id="star-container">
                            <div id="grey-stars" class="stars" style={`background-image: url('${grayStar}');`}></div>
                            <div
                                id="yellow-stars"
                                class="stars"
                                style={`background-image: url('${yellowStar}'); width: ${24 * stars[i]}px;`}
                            ></div>
                            <div id="interaction-fields">
                                {#each new Array(10) as _, num}
                                    <button
                                        on:mouseenter={() => {
                                            setStars(i, (num + 1) / 2);
                                        }}
                                        on:click={() => {
                                            clickStars(i, (num + 1) / 2);
                                        }}
                                        on:mouseleave={() => {
                                            setToSavedStars(i);
                                        }}
                                    ></button>
                                {/each}
                            </div>
                        </div>
                        <button
                            type="button"
                            class="rate-button"
                            on:click={() => {
                                rateAdvert(i);
                            }}>Értékelés</button
                        >
                    </div>
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
        <hr />
        <div class="title-container">
            <h2>Értékelt hirdetések</h2>
        </div>
        {#each data.ratedAdverts as advert}
            <div class="advert">
                <div class="owner-container">
                    <div
                        class="profile-picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.owner.picture}')`}
                    ></div>
                    <a href={advert.ownerId ? `/profile/${advert.ownerId}` : ""}>{advert.owner.name}</a>
                </div>
                <form method="post" action="?/deleteItem" class="top-bar">
                    <span>{advert.location.name} ({advert.location.zip})</span>
                    <input type="hidden" name="advertId" value={advert.id} />
                </form>
                <div class="picture-container">
                    <!-- svelte-ignore a11y-missing-content -->
                    <a
                        href={`/advert/${advert.id}`}
                        title={advert.title}
                        class="picture"
                        style={`background-image: url('data:image/jpeg;base64,${advert.mainPicture.data}')`}
                    ></a>
                </div>
                <div class="title-container">
                    <h2 title={advert.title}>{advert.title.substring(0, 45)}{advert.title.length > 45 ? "..." : ""}</h2>
                    <div class="row">
                        <div id="star-container">
                            <div id="grey-stars" class="stars" style={`background-image: url('${grayStar}');`}></div>
                            <div
                                id="yellow-stars"
                                class="stars"
                                style={`background-image: url('${yellowStar}'); width: ${24 * advert.rating}px;`}
                            ></div>
                        </div>
                    </div>
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

        @include tablet {
            flex-direction: column;
            padding: 0 0.5rem;
        }

        #advert-list {
            flex: 1;
            padding: 1.5rem 1.5rem;
            padding-left: 0;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;

            @include tablet {
                padding: 0.5rem 0.5rem;
                flex: 0;
            }

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
                word-break: break-word;

                @include tablet {
                    grid-template-columns: 40% 60%;
                    height: 20rem;
                }

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

                        @include tablet {
                            width: 100%;
                        }
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

        .title-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: space-between;

            .row {
                width: 100%;
                display: flex;
                gap: 2rem;

                .rate-button {
                    padding: 0.25rem 0.5rem;
                    border-radius: 10px;
                    border: 1px solid $color-dark-blue;
                    font-size: 1rem;
                    cursor: pointer;

                    &:hover {
                        background-color: $color-dark-blue;
                        color: $color-white;
                    }

                    &:active {
                        background-color: $color-dark-blue;
                        color: $color-white;
                    }

                    &:disabled {
                        background-color: darken($color-white, 30%);
                        color: $color-black;
                        cursor: not-allowed;

                        &:hover {
                            background-color: darken($color-white, 30%);
                            color: $color-black;
                        }
                    }
                }

                #star-container {
                    width: calc(24px * 5);
                    height: calc(24px * 1);
                    position: relative;

                    .stars {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-size: 24px;
                        background-repeat: repeat-x;
                        background-position: left;
                    }

                    #yellow-stars {
                        z-index: 2;
                        // width: calc(24px * 2.5);
                    }

                    #interaction-fields {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: grid;
                        grid-template-columns: repeat(10, 1fr);
                        z-index: 5;

                        button {
                            border: none;
                            outline: none;
                            cursor: pointer;
                            background: none;

                            &:focus {
                                background-color: rgb(255, 255, 255, 0.5);
                            }
                        }
                    }
                }
            }

            .button-container {
                display: flex;
                justify-content: flex-end;
                align-items: center;

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

                    &:disabled {
                        background-color: darken($color-white, 30%);
                        color: $color-black;
                        cursor: not-allowed;

                        &:hover {
                            background-color: darken($color-white, 30%);
                            color: $color-black;
                        }
                    }
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

            @include tablet {
                width: 100%;
                padding: 0.5rem 0.5rem;
            }

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

                    &:disabled {
                        background-color: darken($color-blue, 30%);
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
</style>

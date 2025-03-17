<script lang="ts">
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import { error, type SubmitFunction } from "@sveltejs/kit";
    import type { PageData } from "./$types";
    import { invalidateAll, onNavigate } from "$app/navigation";
    import { enhance } from "$app/forms";
    import placeholder from "$lib/images/placeholder.png";
    import grayStar from "$lib/images/star_gray.svg";
    import yellowStar from "$lib/images/star_yellow.svg";

    export let data: PageData;

    if (!data.user) {
        error(404, "User not found");
    }

    // console.log(data)

    let pictureForm: HTMLFormElement;
    let bioForm: HTMLFormElement;

    let editingBio = false;

    let editedBio = data.user.bio;

    function bioButtonClick() {
        if (editingBio) {
            bioForm.submit();
        }

        editingBio = !editingBio;
    }

    function autofocus(node: HTMLElement) {
        node.focus();
    }

    const pictureEnhance: SubmitFunction = ({ formData, cancel }) => {
        const file = formData.get("file") as File;

        if (file.size > 50 * 1024 * 1024) {
            alert("A kép mérete nem lehet nagyobb, mint 50MB");
            cancel();
        }

        return async ({ update }) => {
            invalidateAll();
            await update();
        };
    };

    let editingPassword = false;
</script>

<!-- TODO star functionality -->
<div id="profile-container">
    <!-- <div id="profile"> -->
    <form
        method="post"
        action="?/picture"
        class="pic"
        enctype="multipart/form-data"
        bind:this={pictureForm}
        use:enhance={pictureEnhance}
    >
        <div
            class="picture"
            style={`background-image: url(${data.user.picture ? "data:image/jpeg;base64," + data.user.picture : placeholder})`}
        ></div>
        {#if data.isOwn}
            <input
                type="file"
                name="file"
                id="file"
                accept=".jpg,.png,.webp,.gif,.avif"
                multiple={false}
                on:change={() => {
                    pictureForm.requestSubmit();
                }}
            />
        {/if}
    </form>
    <div class="infos">
        <h1>{data.user.name}</h1>
        <div class="row">
            <span>Csatlakozott:</span>
            <span>{new Date(data.user.regDate).toLocaleDateString()}</span>
        </div>
        {#if data.isOwn}
            <div class="row">
                <span>Email:</span>
                <span>{data.user.email}</span>
            </div>
        {/if}
        <div class="row">
            <span>Hirdetések:</span>
            <span>{data.advertCount} db</span>
        </div>
        {#if data.user.rating != null && data.user.rating != 0}
            <div class="row">
                <div id="star-container">
                    <div id="grey-stars" class="stars" style={`background-image: url('${grayStar}');`}></div>
                    <div
                        id="yellow-stars"
                        class="stars"
                        style={`background-image: url('${yellowStar}'); width: ${24 * data.user.rating}px;`}
                    ></div>
                </div>
            </div>
        {/if}
        {#if data.isOwn}
            <div class="row">
                {#if !editingPassword}
                    <button
                        on:click={() => {
                            editingPassword = true;
                        }}
                    >
                        Jelszó módosítás
                    </button>
                {:else}
                    <form
                        method="post"
                        action="?/password"
                        use:enhance={async () => {
                            return async ({ update }) => {
                                await update();
                                editingPassword = false;
                            };
                        }}
                    >
                        <button
                            type="button"
                            class="cancel"
                            on:click={() => {
                                editingPassword = false;
                            }}>&times;</button
                        >
                        <input type="password" name="new-password" id="new-password" placeholder="Új jelszó" />
                        <button type="submit">Módosítás</button>
                    </form>
                {/if}
            </div>
        {/if}
        <!-- <div class="row">
            <span>Értékelés:</span>
            <span>????</span>
        </div> -->
    </div>
    <form method="post" action="?/bio" class="bio" bind:this={bioForm}>
        <div class="row">
            <h2>Rólam</h2>
            {#if data.isOwn}
                <button on:click={bioButtonClick} type="button">
                    {!editingBio ? "Módosít" : "Mentés"}
                </button>
            {/if}
            {#if editingBio}
                <div class="counter">
                    <span>{editedBio.length}</span>
                    <span>/</span>
                    <span>700</span>
                </div>
            {/if}
        </div>
        {#if editingBio}
            <textarea id="editedBio" name="editedBio" use:autofocus bind:value={editedBio} maxlength="700"></textarea>
        {:else}
            <p class={data.user.bio == "" ? "empty" : ""}>
                {data.user.bio || "Nincs megadva"}
            </p>
        {/if}
    </form>
    <!-- </div> -->
</div>
<div id="adverts"></div>

<style lang="scss" scoped>
    @import "$lib/styles/variables.scss";

    #profile-container {
        width: 100%;
        height: 40vh;
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 1fr 1.5fr 1fr 1fr;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        gap: 2rem;
        // padding: 0 10rem 0 10rem;

        @include tablet {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 50% 50%;
            gap: 0.5rem;
        }

        @include mobile {
            grid-template-columns: 1fr 1.5fr;
            grid-template-rows: 50% 50%;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        .pic {
            grid-column: 2;
            height: 50%;
            margin-right: 10rem;
            position: relative;

            @include tablet {
                height: 100%;
                padding: 1rem;
                padding-left: 0;
                margin-right: 0;
            }

            @include mobile {
                grid-column: 1;
            }

            .picture {
                aspect-ratio: 1/1;
                height: 100%;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                border-radius: 50%;
            }

            input {
                position: absolute;
                aspect-ratio: 1/1;
                height: 100%;

                @include tablet {
                    top: 1rem;
                    height: calc(100% - 2rem);
                }

                top: 0;
                left: 0;
                border-radius: 50%;

                & {
                    visibility: hidden;
                }

                &:hover::before {
                    content: "Kép módosítása";
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

        .row {
            display: flex;
            align-items: start;
            gap: 0.2rem;

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
                    background-size: contain;
                    background-repeat: repeat-x;
                    background-position: left;
                }

                #yellow-stars {
                    z-index: 2;
                    // width: calc(24px * 2.5);
                }
            }

            form {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            input {
                margin-right: 0.5rem;
                padding: 0.2rem;
                border: 1px solid $color-blue;
            }

            button {
                margin-top: 0.4rem;
                background: none;
                border: none;
                cursor: pointer;
                color: $color-blue;
                font-size: 1rem;

                &:focus {
                    outline: 1px solid black;
                }

                &:hover {
                    text-decoration: underline;
                }

                &.cancel {
                    color: $color-red;
                    display: grid;
                    place-items: center;

                    &:hover {
                        text-decoration: none;
                    }
                }
            }
        }

        .infos {
            grid-column: 3;
            width: 100%;
            line-break: anywhere;

            @include tablet {
                grid-column: 3 / 4;
            }

            @include mobile {
                grid-column: 2;
            }

            span:first-child {
                font-weight: bold;
            }
        }

        .bio {
            grid-column: 4/6;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            height: 8rem;
            max-width: 100%;

            @include tablet {
                grid-column: 2 / span 2;
                padding-left: 1rem;
                padding-right: 1rem;
                grid-row: 2;
            }

            @include mobile {
                grid-column: 1 / span 2;
            }

            p {
                white-space: pre-wrap;
                word-wrap: break-word;
                word-break: break-all;
                width: 70%;
                height: 100%;
                // border: 1px solid black;
                overflow-y: auto;

                // only display scrollbar thumb
                scrollbar-color: $color-dark-blue transparent;
                scrollbar-width: thin;
            }

            .counter {
                margin-left: 1rem;
            }

            textarea {
                width: 70%;
                min-width: 30%;
                max-width: 80%;
                max-height: 200%;
                min-height: 70%;
                height: 150%;
                padding: 5px;

                @include tablet {
                    width: 100%;
                    max-width: 100%;
                }
            }

            button {
                background: none;
                border: none;
                cursor: pointer;
                color: $color-blue;
                font-size: 0.7rem;

                &:hover {
                    text-decoration: underline;
                }
            }

            .empty {
                font-style: italic;
            }
        }
    }
</style>

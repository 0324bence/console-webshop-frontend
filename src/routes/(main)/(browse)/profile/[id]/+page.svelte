<script lang="ts">
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import { error } from "@sveltejs/kit";
    import type { PageData } from "./$types";
    import { invalidateAll, onNavigate } from "$app/navigation";

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
</script>

<div id="profile-container">
    <!-- <div id="profile"> -->
    <form method="post" action="?/picture" class="pic" enctype="multipart/form-data" bind:this={pictureForm}>
        <UserPlaceholder url={data.user.picture} />
        {#if data.isOwn}
            <input
                type="file"
                name="file"
                id="file"
                accept=".jpg,.png,.webp,.gif,.avif"
                multiple={false}
                on:change={() => {
                    pictureForm.submit();
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
        <div class="row">
            <span>Email:</span>
            <span>{data.user.email}</span>
        </div>
        <div class="row">
            <span>Hirdetések:</span>
            <span>????</span>
        </div>
        <div class="row">
            <span>Értékelés:</span>
            <span>????</span>
        </div>
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
        .pic {
            grid-column: 2;
            height: 50%;
            margin-right: 10rem;
            position: relative;

            input {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid red;
                top: 0;
                left: 0;
                border-radius: 50%;

                visibility: hidden;

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
        }

        .infos {
            grid-column: 3;
            width: 100%;

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

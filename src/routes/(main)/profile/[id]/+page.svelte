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
</script>

<div class="main-container">
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
        <div class="bio">
            <div class="row">
                <h2>Rólam</h2>
            </div>
            <p class={data.user.bio == "" ? "empty" : ""}>
                {data.user.bio || "Nincs megadva"}
            </p>
        </div>
        <!-- </div> -->
    </div>
    <div id="adverts"></div>
</div>

<style lang="scss" scoped>
    @import "$lib/styles/variables.scss";

    .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        #profile-container {
            width: 100%;
            height: 40vh;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 0 10rem 0 10rem;
            .pic {
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

            .infos {
                width: 30%;

                span:first-child {
                    font-weight: bold;
                }
            }

            .bio {
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: start;
                height: 8rem;

                .empty {
                    font-style: italic;
                }
            }
        }
    }
</style>

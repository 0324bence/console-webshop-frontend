<script lang="ts">
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import { error } from "@sveltejs/kit";
    import type { PageData } from "./$types";

    export let data: PageData;

    if (!data.user) {
        error(404, "User not found");
    }

    console.log(data);
</script>

<div class="main-container">
    <div id="profile-container">
        <!-- <div id="profile"> -->
        <div class="pic">
            <UserPlaceholder />
        </div>
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
            <h2>Rólam</h2>
            <p class={data.user.bio == "" ? "empty" : ""}>
                {data.user.bio || "Nincs megadva"}
            </p>
        </div>
        <!-- </div> -->
    </div>
    <div id="adverts"></div>
</div>

<style lang="scss" scoped>
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

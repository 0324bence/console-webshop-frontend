<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    // console.log(data);
</script>

<!-- TODO pagination -->

<div id="users-container">
    {#each data.users as user}
        <div class="user">
            <div class="profile-picture-container">
                <div
                    class="profile-picture"
                    style={`background-image: url('data:image/jpeg;base64,${user.picture}')`}
                ></div>
            </div>
            <div class="data">
                <h2>{user.name}</h2>
                <p>{user.regDate}</p>
            </div>
        </div>
    {/each}
    <!-- <div class="user">
        <div class="profile-picture-container">
            <div class="profile-picture"></div>
        </div>
        <div class="data">
            <h2>Profile name</h2>
            <p>0000-00-00</p>
        </div>
    </div> -->
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #users-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;

        .user {
            display: grid;
            color: $color-black;
            text-decoration: none;
            grid-template-rows: 1fr 1fr;
            width: 100%;
            padding: 1rem;
            border-radius: 0.3rem;
            height: 12em;
            width: 10rem;
            // border: 1px solid $color-black;
            background-color: $color-white;
            box-shadow: 1px 1px 5px 0px $color-black;

            .profile-picture-container {
                display: flex;
                justify-content: center;
                align-items: center;
                .profile-picture {
                    width: 5rem;
                    height: 5rem;
                    border-radius: 50%;
                    background-color: $color-black;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }

            .data {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                h2 {
                    font-size: 1.3rem;
                    margin: 0;
                }
                p {
                    font-size: 1rem;
                    margin: 0;
                }
            }
        }
    }
</style>

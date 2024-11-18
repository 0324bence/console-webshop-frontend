<script lang="ts">
    import Cart from "$lib/svgs/Cart.svelte";
    import Logo from "$lib/svgs/Logo.svelte";
    import Search from "$lib/svgs/Search.svelte";
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    let userMenu = false;

    console.log(JSON.stringify(data));
</script>

<div id="window-container">
    <div id="header">
        <div id="logo-container">
            <Logo />
        </div>
        <div id="center-container">
            <form>
                <input type="text" placeholder="Keresés..." />
                <button type="submit">
                    <Search />
                </button>
            </form>
        </div>
        <div id="right-container">
            <Cart />
            {#if data.token === null}
                <div id="nologin">
                    <a href="/auth/login">Bejelentkezés</a>
                    <a href="/auth/register">Regisztráció</a>
                </div>
            {:else}
                <button
                    id="user-button"
                    on:click={() => {
                        userMenu = !userMenu;
                    }}
                >
                    <UserPlaceholder />
                </button>
                <div id="user-menu" class={userMenu ? "" : "hidden"}>
                    <a href="/profile" class="menu-item"> Profil </a>
                    <a href="/auth/logout" class="menu-item" data-sveltekit-reload> Kijelentkezés </a>
                </div>
            {/if}
            <!-- <UserPlaceholder /> -->
        </div>
    </div>
    <div id="content">
        <slot />
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #nologin {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        a {
            color: $color-white;
            font-size: 1.3rem;
        }
    }

    #window-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
    }

    #header {
        width: 100%;
        z-index: 2;
        height: 7rem;
        padding: 1rem 2rem 1rem 2rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        background-color: $color-blue;
        position: relative;

        #logo-container {
            height: 100%;
        }

        #center-container {
            flex: 1;
            height: 100%;

            form {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
            }

            input {
                flex: 1;
            }

            input,
            button {
                padding: 0.5rem;
                border-radius: 15px;
                border: 1px solid $color-dark-blue;
                font-size: 1.2rem;
                outline: none;
            }

            button {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2.5rem;
                width: 2.5rem;
            }
        }

        #right-container {
            display: flex;
            gap: 2rem;
            height: 100%;
            padding: 0.7rem;

            button {
                background: none;
                border: none;
                cursor: pointer;
            }

            #user-menu {
                position: absolute;
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
                align-items: stretch;
                z-index: -1;
                top: 100%;
                right: 0;
                background-color: $color-dark-blue;
                border: 1px solid $color-dark-blue;
                width: 20rem;
                pointer-events: all;
                transition: transform 0.3s;
                // transform: translateY(0%);
                visibility: visible;

                &.hidden {
                    // transform: translateY(-100%);
                    pointer-events: none;
                    display: none;
                    // visibility: hidden;
                }

                .menu-item {
                    background-color: $color-white;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;

                    color: $color-black;
                    font-size: 1.2rem;

                    text-decoration: none;

                    cursor: pointer;
                }
            }
        }
    }

    #content {
        flex: 1;
    }
</style>

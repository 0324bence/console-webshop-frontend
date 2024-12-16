<script lang="ts">
    import { afterNavigate, goto, onNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import Cart from "$lib/svgs/Cart.svelte";
    import Logo from "$lib/svgs/Logo.svelte";
    import Search from "$lib/svgs/Search.svelte";
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    let userMenu = false;

    function closeMenu() {
        if (userMenu) userMenu = false;
    }

    let searchFieldValue = $page.url.searchParams.get("title") || "";
    let searchFieldFocus = false;

    function searchAdvert() {
        goto($page.url.pathname + "?title=" + searchFieldValue + "&");
    }

    function searchUser() {
        console.log("searching for user ", searchFieldValue);
    }

    afterNavigate(() => {
        searchFieldValue = $page.url.searchParams.get("title") || "";
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="window-container" on:click={closeMenu}>
    <div id="header">
        <a href="/" id="logo-container">
            <Logo />
        </a>
        <div id="center-container">
            <form on:submit|preventDefault class="searchContainer">
                <input
                    type="text"
                    placeholder="Keresés..."
                    bind:value={searchFieldValue}
                    on:focus={() => {
                        searchFieldFocus = true;
                    }}
                    on:blur={() => (searchFieldFocus = false)}
                />
                <!-- <button type="submit">
                    <Search />
                </button> -->
                {#if searchFieldValue.length > 0 && searchFieldFocus}
                    <div class="searchOptions">
                        <button type="submit" on:click={searchAdvert}
                            >"<b>{searchFieldValue}</b>" című hirdetés keresése</button
                        >
                        <button on:click={searchUser}>"<b>{searchFieldValue}</b>" nevű felhasználó keresése</button>
                    </div>
                {/if}
            </form>
        </div>
        <div id="right-container">
            <Cart />
            {#if data.token === null || data.ownUser === null}
                <div id="nologin">
                    <a href="/auth/login">Bejelentkezés</a>
                    <a href="/auth/register">Regisztráció</a>
                </div>
            {:else}
                <button
                    id="user-button"
                    on:click|stopPropagation={() => {
                        userMenu = !userMenu;
                    }}
                >
                    <UserPlaceholder url={data.ownUser.picture} />
                </button>
                <div id="user-menu" class={userMenu ? "" : "hidden"}>
                    <a href="/profile" class="menu-item">Profil</a>
                    <a href="/advert/create" class="menu-item">Új hirdetés</a>
                    <a href="/auth/logout" class="menu-item" data-sveltekit-reload>Kijelentkezés</a>
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
            display: block;
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
                position: relative;
            }

            .searchOptions {
                position: absolute;
                display: flex;
                flex-direction: column;
                width: 100%;
                right: 0;
                top: 80%;

                button {
                    border-radius: 0;
                    width: 100%;
                }
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
                cursor: pointer;
                background-color: $color-white;

                &:hover {
                    background-color: darken($color-white, 10%);
                }

                &[type="submit"] {
                    background-color: darken($color-white, 10%);
                }
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
                gap: 2px;
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

                    &:hover {
                        background-color: darken($color-white, 10%);
                    }
                }
            }
        }
    }

    #content {
        flex: 1;
        min-height: 0;
    }
</style>

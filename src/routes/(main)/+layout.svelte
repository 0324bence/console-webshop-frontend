<script lang="ts">
    import { afterNavigate, goto, onNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import Cart from "$lib/svgs/Cart.svelte";
    import Logo from "$lib/svgs/Logo.svelte";
    import Search from "$lib/svgs/Search.svelte";
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import logo from "$lib/images/logo.svg";
    import cart from "$lib/images/cart.svg";
    import placeholder from "$lib/images/placeholder.png";

    export let data: LayoutData;

    let userMenu = false;

    function closeMenu() {
        if (userMenu) userMenu = false;
    }

    let searchFieldValue = $page.url.searchParams.get("title") || $page.url.searchParams.get("name") || "";
    let searchFieldFocus = false;
    let selectedSearchOption = 0;

    function searchAdvert() {
        // console.log("searching for advert ", searchFieldValue);
        goto($page.url.pathname + "?title=" + searchFieldValue + "&");
    }

    function searchUser() {
        // console.log("searching for user ", searchFieldValue);
        goto("/profiles?name=" + searchFieldValue);
    }

    function formSubmit() {
        if (selectedSearchOption == 0) {
            searchAdvert();
        } else {
            searchUser();
        }
    }

    const keyupListener = (e: KeyboardEvent) => {
        if (searchFieldFocus && searchFieldValue.length > 0) {
            if (e.key == "ArrowDown" || e.key == "ArrowUp") {
                e.preventDefault();
                selectedSearchOption = selectedSearchOption == 1 ? 0 : 1;
            }
        }
    };

    onMount(() => {
        document.addEventListener("keydown", keyupListener);

        return () => {
            document.removeEventListener("keydown", keyupListener);
        };
    });

    afterNavigate(() => {
        searchFieldValue = $page.url.searchParams.get("title") || $page.url.searchParams.get("name") || "";
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="window-container" on:click={closeMenu}>
    <div id="header">
        <a href="/" id="logo-container" style={`background-image: url(${logo})`}>
            <!-- <Logo /> -->
        </a>
        <div id="center-container">
            <form on:submit|preventDefault={formSubmit} class="searchContainer">
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
                        <button
                            type={selectedSearchOption == 0 ? "submit" : "button"}
                            on:mousedown={searchAdvert}
                            class={selectedSearchOption == 0 ? "selected" : ""}
                        >
                            "<b>{searchFieldValue}</b>" című hirdetés keresése
                        </button>
                        <button
                            on:mousedown={searchUser}
                            type={selectedSearchOption == 1 ? "submit" : "button"}
                            class={selectedSearchOption == 1 ? "selected" : ""}
                        >
                            "<b>{searchFieldValue}</b>" nevű felhasználó keresése
                        </button>
                    </div>
                {/if}
            </form>
        </div>
        <div id="right-container">
            <div id="cart" style={`background-image: url(${cart})`}></div>
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
                    style={`background-image: url(${data.ownUser?.picture ? "data:image/jpeg;base64," + data.ownUser?.picture : placeholder})`}
                >
                    <!-- <UserPlaceholder url={data.ownUser.picture} /> -->
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
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        a {
            color: $color-white;
            font-size: 1rem;
        }
    }

    #window-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background-color: darken($color-white, 10%);
    }

    #header {
        width: 100%;
        z-index: 2;
        min-height: 7rem;
        padding: 1rem 1.5rem 1rem 1.5rem;
        display: grid;
        grid-template-columns: 1.5fr 11fr 1.5fr;
        // gap: 2rem;
        align-items: center;
        background-color: $color-blue;
        position: relative;

        @include mobile {
            grid-template-columns: 2fr 2fr;
            grid-template-rows: 1fr 1fr;
        }

        #logo-container {
            display: block;
            height: 100%;
            width: 100%;
            background-position: center left;
            background-size: contain;
            background-repeat: no-repeat;

            @include mobile {
                grid-column: 1;
                grid-row: 1;
                margin-left: 0.5rem;
            }
        }

        #center-container {
            height: 100%;
            width: 100%;

            @include mobile {
                grid-column: 1 / span 2;
                grid-row: 2;
            }

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
            gap: 1rem;
            height: 100%;
            padding: 0.7rem;

            @include mobile {
                grid-column: 2;
                grid-row: 1;
                padding: 0.4rem;
                padding-right: 0.5rem;
            }

            #cart {
                height: 100%;
                flex: 1;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
            }

            button {
                background: none;
                border: none;
                cursor: pointer;
                height: 100%;
                max-height: 7rem;
                flex: 1;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
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

                @include mobile {
                    width: 100%;
                }

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
        display: flex;
        flex-direction: column;
    }
</style>

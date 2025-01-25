<script lang="ts">
    import type { ActionData, PageData } from "../../../../.svelte-kit/types/src/routes/auth/[action]/$types";
    import Controller from "$lib/svgs/Controller.svelte";
    import Logo from "$lib/svgs/Logo.svelte";
    import { goto } from "$app/navigation";
    import logo from "$lib/images/logo.svg";
    import controller from "$lib/images/controller.svg";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
    <title>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</title>
</svelte:head>

<div id="main-container" style={"background-image: url(" + controller + ")"}>
    <button
        on:click={() => {
            goto("/");
        }}
        style={"background-image: url(" + logo + ")"}
        class="logo"
        title="logo"
    >
    </button>

    <form method="post">
        <h1>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</h1>
        <div class="group">
            <label for="name">Felhasználó név</label>
            <input type="text" id="name" name="name" required />
        </div>

        {#if data.action === "register"}
            <div class="group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required />
            </div>
        {/if}

        <div class="group">
            <label for="password">Jelszó</label>
            <input type="password" name="password" id="password" required />
        </div>

        <span id="error">{form?.message || ""}</span>

        {#if data.action === "login"}
            <a href="register">Regisztráció</a>
        {/if}

        <input
            type="submit"
            formaction="?/{data.action}"
            value={data.action === "login" ? "Bejelentkezés" : "Regisztráció"}
        />
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    // #main-container {
    //     display: flex;
    //     height: 100vh;
    // }
    #main-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5rem;
        width: 100%;
        background-repeat: no-repeat;
        background-size: 30%;
        background-position: right bottom;
        background-attachment: fixed;

        @include mobile {
            background-image: none !important;
        }

        .logo {
            background: none;
            border: none;

            cursor: pointer;
            display: block;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 25rem;
            max-width: 80%;
            height: 15rem;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        width: 20rem;
        margin: 0 auto;
        padding: 1rem;
        border: $color-dark-blue 2px solid;
        border-radius: 2rem;
        background-color: $color-blue;
        font-family: "Roboto", sans-serif;

        h1 {
            text-align: center;
            font-weight: bold;
            color: $color-white;
        }

        .group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        label {
            color: $color-white;
        }

        input {
            padding: 0.5rem;
            color: $color-black;
            border: 1px solid $color-dark-blue;
            border-radius: 0.25rem;
        }

        input[type="submit"] {
            background-color: $color-blue;
            color: $color-white;
            border: $color-white 1px solid;
            // border: none;
            box-shadow: 2px 2px 5px $color-dark-blue;
            border-radius: 0.25rem;
            padding: 0.5rem;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            cursor: pointer;

            &:hover {
                background-color: darken($color-blue, 5%);
            }

            &:active {
                box-shadow: 1px 1px 5px $color-dark-blue;
            }
        }

        #error {
            color: red;
            text-align: center;
        }

        a {
            text-align: center;
            color: $color-white;
            text-decoration: underline;
        }
    }
</style>

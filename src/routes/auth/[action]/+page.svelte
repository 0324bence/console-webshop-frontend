<script lang="ts">
    import type { ActionData, PageData } from "../../../../.svelte-kit/types/src/routes/auth/[action]/$types";
    import Controller from "$lib/svgs/Controller.svelte";
    import Logo from "$lib/svgs/Logo.svelte";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
    <title>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</title>
</svelte:head>

<div id="main-container">
    <div id="left-container">
        <button
            on:click={() => {
                history.back();
            }}
            class="logo"
            title="logo"
        >
            <Logo />
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
                <input type="password" name="password" id="password" />
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
    <div id="right-container">
        <div id="svg-container">
            <Controller />
        </div>
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #main-container {
        display: flex;
        height: 100vh;
    }
    #left-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5rem;

        .logo {
            background: none;
            border: none;

            cursor: pointer;
            display: block;
            width: 55%;
            margin-left: 5%;
        }
    }

    #right-container {
        padding: 1rem;
        padding-right: 0;
        flex: 1;
        display: flex;
        justify-content: end;
        align-items: end;

        #svg-container {
            height: 50%;

            svg {
                width: 100%;
                height: 100%;
            }
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
            background-color: $color-light-blue;
            color: $color-dark-blue;
            border: $color-dark-blue 1px solid;
            border: none;
            border-radius: 0.25rem;
            padding: 0.5rem;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: darken($color-light-blue, 10%);
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

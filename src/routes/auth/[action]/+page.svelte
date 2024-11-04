<script lang="ts">
    import type { ActionData, PageData } from "../../../../.svelte-kit/types/src/routes/auth/[action]/$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
    <title>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</title>
</svelte:head>

<div id="container">
    <form method="post">
        <h1>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</h1>
        <div class="group">
            <label for="name">Felhasználó név</label>
            <input type="text" id="name" name="name" required />
        </div>

        {#if data.action === "register"}
            <div class="group">
                <label for="email">E-Mail</label>
                <input type="text" id="email" name="email" required />
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

<style lang="scss">
    #container {
        display: flex;
        height: 100vh;
        flex-direction: column;
        justify-content: center;
    }
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        width: 20rem;
        margin: 0 auto;
        padding: 1rem;
        border: #007bff 2px solid;
        border-radius: 2rem;

        h1 {
            text-align: center;
        }

        .group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        label {
            font-weight: bold;
        }

        input {
            padding: 0.5rem;
            color: black;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            background-color: hsl(0, 0%, 90%);
        }

        input[type="submit"] {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.5rem;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #0056b3;
        }

        #error {
            color: red;
            text-align: center;
        }

        a {
            text-align: center;
            color: #007bff;
            text-decoration: underline;
        }
    }
</style>

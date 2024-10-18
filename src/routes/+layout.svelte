<script lang="ts">
    import Cart from "$lib/svgs/Cart.svelte";
    import Logo from "$lib/svgs/Logo.svelte";
    import Search from "$lib/svgs/Search.svelte";
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
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
            <UserPlaceholder />
        </div>
    </div>
    <div id="content">
        <slot />
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #window-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
    }

    #header {
        width: 100%;
        height: 10rem;
        padding: 1rem 2rem 1rem 2rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        background-color: $color-blue;

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
            padding: 0.8rem;
        }
    }

    #content {
        flex: 1;
    }
</style>

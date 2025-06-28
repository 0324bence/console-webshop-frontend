<div id="form-container">
    <form id="form" action="?/suggestion" method="post">
        <h1>Javaslat küldése</h1>
        <input type="text" name="title" placeholder="Tárgy" required />
        <textarea name="text" placeholder="Javaslat" required></textarea>
        <div id="button-container"><button type="submit">Küldés</button></div>
    </form>
</div>

<style lang="scss">
    @import "$lib/styles/variables";
    #form-container {
        display: flex;
        flex-direction: column;
        // justify-content: center;
        // align-items: center;
        height: 100%;
        padding: 10rem;

        @include tablet {
            padding: 5rem;
        }

        @include mobile {
            padding: 1rem;
        }

        flex: 1;
    }

    #form {
        display: flex;
        height: 100%;
        width: 100%;
        flex: 1;
        flex-direction: column;
        align-items: center;
        border: 1px solid $color-black;
        border-radius: 10px;
        box-shadow: 1px 1px 5px 0px rgba($color-black, 0.5);
        background-color: $color-white;
        padding: 1rem;
        gap: 2rem;

        h1 {
            font-size: 2rem;
            margin-bottom: auto;
        }

        textarea {
            font-size: 1.2rem;
            // font-weight: bold;
            background-color: transparent;
            padding: 5px;
            flex: 1;
            width: 100%;
            resize: none;
        }

        input {
            font-size: 1.4rem;
            font-weight: bold;
            background-color: transparent;
            padding: 5px;
            width: 100%;
            resize: none;
        }

        #button-container {
            display: flex;
            justify-content: end;
            width: 100%;
        }

        button {
            padding: 0.5rem 1rem;
            border-radius: 15px;
            border: 1px solid $color-dark-blue;
            font-size: 1.2rem;
            cursor: pointer;

            &:hover {
                background-color: $color-dark-blue;
                color: $color-white;
            }

            &:active {
                background-color: $color-dark-blue;
                color: $color-white;
            }

            &:disabled {
                background-color: darken($color-white, 30%);
                color: $color-black;
                cursor: not-allowed;

                &:hover {
                    background-color: darken($color-white, 30%);
                    color: $color-black;
                }
            }
        }
    }
</style>

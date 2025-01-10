<script lang="ts">
    export let data;
    console.log(data);
</script>

<div id="advert-content">
    <div id="main-data-container">
        <div id="pictures-container"></div>
        <div id="data-container">
            <div id="title-row">
                <div id="view-count" title="Megtekintések száma">
                    <span>&#128065;</span>
                    <span>300</span>
                </div>
                <div id="title">
                    <h1>Eladó ház</h1>
                    <h3><a href=".">Eladó neve</a></h3>
                </div>
            </div>
            <div id="data">
                <h3>Újszerű</h3>
                <h3>Település neve</h3>
                <h2>5000 HUF</h2>
            </div>
            <div id="button-row">
                <span>Létrehozva: 0000-00-00</span>
                <div id="buttons">
                    <button>&hearts;</button>
                    <button>Kosárba</button>
                </div>
            </div>
        </div>
    </div>
    <div id="description-container"></div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #advert-content {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        min-height: 100%;
        padding-left: 5rem;
        padding-right: 5rem;

        #main-data-container {
            flex: 4;
            // background-color: rgb(20, 83, 62);
            display: flex;

            #pictures-container {
                flex: 1;
                background-color: rgb(20, 83, 62);
            }

            #data-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;
                padding: 1rem;
                gap: 1rem;
                color: $color-black;

                a {
                    color: inherit;
                }

                h1 {
                    font-size: 2.2rem;
                    font-weight: bold;
                }

                h2 {
                    font-size: 1.5rem;
                    font-weight: normal;
                }

                h3 {
                    font-size: 1.2rem;
                    font-weight: normal;
                }

                #title-row {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;

                    #title {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                    }
                }

                #button-row {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;

                    #buttons {
                        display: flex;
                        gap: 1rem;

                        button {
                            padding: 0.5rem 1rem;
                            border-radius: 15px;
                            border: 1px solid $color-dark-blue;
                            font-size: 1.2rem;
                            outline: none;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        #description-container {
            flex: 6;
        }
    }
</style>

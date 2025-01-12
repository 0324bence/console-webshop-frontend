<script lang="ts">
    export let data;
    console.log(data);
</script>

<div id="advert-content">
    <div id="main-data-container">
        <div id="pictures-container">
            <div id="preview-container">
                <div class="image" style="background-image: url('https://placehold.co/160x90/PNG');">
                    <!-- <img src="https://placehold.co/160x90/PNG" alt="Kép 1" /> -->
                </div>
                <div class="image" style="background-image: url('https://placehold.co/900x1600/PNG');">
                    <!-- <img src="https://placehold.co/900x1600/PNG" style="height: 100%; width: auto;" alt="Kép 1" /> -->
                </div>
                <div class="image" style="background-image: url('https://placehold.co/90x160/PNG');">
                    <!-- <img src="https://placehold.co/90x160/PNG" alt="Kép 1" /> -->
                </div>
                <div class="image" style="background-image: url('https://placehold.co/90x160/PNG');">
                    <!-- <img src="https://placehold.co/90x160/PNG" alt="Kép 1" /> -->
                </div>
                <!-- <div class="image">
                    <img src="https://placehold.co/100x100" alt="Kép 1" />
                </div> -->
            </div>
            <div id="main-container">
                <div class="image" style="background-image: url('https://placehold.co/1000x1080/PNG');"></div>
            </div>
        </div>
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
                <h2 class="price">5000 HUF</h2>
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
    <div id="description-container">
        <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente quis, quia harum sequi odio minima enim,
            placeat dolore saepe rerum architecto officia dolorum fugiat! Nesciunt quos odit delectus, nemo animi sunt
            veritatis eligendi porro aperiam eaque, nisi expedita neque excepturi inventore, voluptatem iusto!
            Dignissimos quidem eum quis quam? Suscipit ut exercitationem praesentium modi amet cum provident. Maiores
            atque qui reprehenderit omnis placeat? Quod animi quidem, nisi reprehenderit numquam labore doloribus,
            nihil, eveniet libero est quisquam. Repellendus, labore expedita animi et ipsum illo? Obcaecati, tempore
            quas quam, quae quisquam delectus ullam nam veniam eius, asperiores sint autem est vitae cupiditate
            explicabo incidunt excepturi ipsam ratione quos optio. Sint suscipit consequatur illum in ea sunt voluptatem
            deserunt debitis quo perferendis similique animi, pariatur hic, labore corporis laudantium aperiam qui.
            Error, animi iure a, obcaecati nihil cupiditate quaerat tenetur et possimus, inventore ipsam pariatur natus
            dolore est. Laborum sequi quae ipsa similique eius blanditiis esse alias fuga deserunt incidunt? Cumque
            earum quas consequatur eligendi laudantium alias nemo sint officia vero? Repellat, iure, optio nulla
            perspiciatis eum culpa eveniet, illo dolor recusandae soluta laudantium. Et accusamus quam, enim nobis,
            accusantium praesentium mollitia atque in voluptatibus soluta dolores explicabo laboriosam dolorem adipisci
            repellendus, suscipit illo. Modi porro nostrum dolorem dolore doloremque, ipsum voluptatem eveniet veritatis
            maiores a pariatur. Minus, architecto sunt in corporis impedit autem, odio asperiores consectetur, totam
            provident necessitatibus aperiam saepe doloribus dolorem nihil officiis. Quo quisquam dolorem natus, beatae
            voluptatibus labore atque laboriosam quae cumque assumenda minima ducimus ipsum sit molestiae tempora
            voluptate impedit officiis expedita at excepturi vitae perspiciatis iste maxime eos. Corporis harum neque
            id, mollitia ratione qui cupiditate voluptatum, natus vitae provident, deserunt iste tempore doloremque
            eaque? Eligendi facere debitis aperiam inventore eum molestias numquam, amet quas architecto repellat est
            reprehenderit suscipit magnam laborum repudiandae sunt, dolor odit vitae eius ipsam voluptates esse quod
            veniam nobis. Magnam nam facilis, incidunt doloribus totam unde consequatur deserunt soluta velit harum
            libero eum similique tenetur rem inventore earum accusantium ipsa vitae a corrupti ducimus aut, dolores
            perferendis? Cumque iure consequatur earum nisi nihil sequi corrupti ex ipsum labore dolorum, sapiente fuga
            autem doloremque voluptatum. Assumenda, nam consectetur voluptatem iusto cupiditate laboriosam cum maxime,
            quae, praesentium harum repellendus magnam minus! Sit enim maxime nihil magni. Illo maxime sunt soluta quis?
            Voluptatibus assumenda quo quisquam atque iusto eveniet qui ex, harum veritatis cum dignissimos animi nulla!
            Modi laboriosam cupiditate unde fugit corrupti doloremque quas harum! Iure recusandae repellendus, odit
            dolorum fuga quae? Error alias rem corrupti minus nesciunt saepe sequi labore aliquam ab, eum cumque quia
            amet id ullam nostrum quis, veniam itaque cupiditate sed minima eligendi? Nisi explicabo animi perspiciatis.
            Placeat quam consectetur architecto vitae eum doloribus, itaque dolores at dignissimos est velit nam nulla
            tempore cupiditate sequi sit ea voluptatem obcaecati nihil maiores eveniet culpa. Sequi earum necessitatibus
            temporibus possimus vero rerum officia nemo? Eos quasi quo at quas ipsa. Blanditiis amet impedit eaque rerum
            aperiam! Laudantium, adipisci fugiat. Quae odit, sint placeat doloribus, neque dicta laborum, veritatis
            necessitatibus fugit commodi ipsam.
        </p>
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    #advert-content {
        display: flex;
        // grid-template-rows: 40% 60%;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        min-height: 100%;
        padding-left: 5rem;
        padding-right: 5rem;

        #main-data-container {
            height: 25rem;
            display: flex;

            #pictures-container {
                flex: 1;
                display: grid;
                grid-template-columns: 1.1fr 2.9fr;
                gap: 1rem;
                // background-color: rgb(20, 83, 62);

                #preview-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    overflow-y: auto;
                    height: 100%;
                    max-height: 100%;

                    .image {
                        aspect-ratio: 16 / 9;
                        width: 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid $color-black;
                        border-radius: 5px;
                    }
                }

                #main-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;

                    .image {
                        width: 100%;
                        height: 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid $color-black;
                        border-radius: 5px;
                        background-color: $color-white;
                    }
                }
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

                        a {
                            color: $color-dark-blue;
                        }
                    }
                }

                #data {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 1rem;

                    .price {
                        font-weight: bold;
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
                            cursor: pointer;

                            &:hover {
                                background-color: $color-dark-blue;
                                color: $color-white;
                            }

                            &:active {
                                background-color: $color-dark-blue;
                                color: $color-white;
                            }
                        }
                    }
                }
            }
        }

        #description-container {
            padding: 1rem;
            flex-grow: 0;
            height: 60%;

            p {
                display: block;
                width: 100%;
                height: 100%;
                word-wrap: normal;
                white-space: pre-wrap;
            }
        }
    }
</style>

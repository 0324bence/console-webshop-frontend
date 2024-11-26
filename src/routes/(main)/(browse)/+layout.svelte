<slot></slot>
<div class="main-container">
    <div id="filter-container"></div>
    <div id="sorting-container"></div>
    <div id="advert-container"></div>
</div>

<style lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        display: grid;
        grid-template-columns: 3fr 17fr;
        grid-template-rows: 1fr 15fr;

        #filter-container {
            grid-row: span 2;
        }

        div {
            border: 1px solid black;
        }
    }
</style>

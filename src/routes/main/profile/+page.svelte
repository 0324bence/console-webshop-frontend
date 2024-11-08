<script lang="ts">
    import UserPlaceholder from "$lib/svgs/UserPlaceholder.svelte";
</script>

<div class="main-container">
    <div id="profile-container">
        <div id="profile">
            <div class="pic">
                <UserPlaceholder />
            </div>
            <div class="infos">
                <h1>Username</h1>
                <div class="row">
                    <span>Csatlakozott:</span>
                    <span>2040. 01. 01.</span>
                </div>
                <div class="row">
                    <span>Hirdetések:</span>
                    <span>5</span>
                </div>
                <div class="row">
                    <span>Értékelés:</span>
                    <span>5/5</span>
                </div>
            </div>
        </div>
    </div>
    <div id="adverts"></div>
</div>

<style lang="scss" scoped>
    .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        #profile-container {
            width: 100%;
            height: 40vh;
            display: flex;
            align-items: center;
            padding-left: 5rem;
        }
    }
</style>

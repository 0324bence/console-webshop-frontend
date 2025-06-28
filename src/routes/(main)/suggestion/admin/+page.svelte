<script lang="ts">
    export let data;
</script>

<table>
    <thead>
        <tr>
            <th class="col1">Szerző</th>
            <th class="col2">Létrehozás ideje</th>
            <th class="col3">Cím</th>
            <th class="col4">Leírás</th>
        </tr>
    </thead>
    <tbody>
        {#each data.suggestions as suggestion}
            <tr>
                <td class="col1">
                    <div class="profile-container">
                        <div
                            class="profile-picture"
                            style={`background-image: url('data:image/jpeg;base64,${suggestion.user.picture}')`}
                        ></div>
                        <a href={suggestion.userId ? `/profile/${suggestion.userId}` : ""}>{suggestion.user.name}</a>
                    </div>
                </td>
                <td class="col2"
                    >{suggestion.createdTime.toLocaleString("hu-HU", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}</td
                >
                <td class="col3">{suggestion.title}</td>
                <td class="col4">{suggestion.text}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid black;
        padding: 0.5rem;
        text-align: center;
    }

    .col1 {
        min-width: 10%;
        width: 10%;
        max-width: 20%;
    }

    .col2 {
        width: 10%;
    }

    .col3 {
        min-width: 20%;
        width: 20%;
        max-width: 40%;
    }

    .col4 {
        min-width: 40%;
        width: 40%;
        max-width: 60%;
    }

    .profile-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .profile-picture {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        margin-right: 1rem;
        display: inline-block;
    }
</style>

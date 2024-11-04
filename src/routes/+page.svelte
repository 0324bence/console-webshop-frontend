<script lang="ts">
    import { goto } from "$app/navigation";
    import apiPath from "$lib/apiPath";

    function testFetch() {
        const route = `${apiPath}/test`;
        console.log(route);
        fetch(route, {
            // mode: "no-cors"
        })
            .then(res => {
                console.log(res);
                return res.text();
            })
            .then(data => {
                console.log(data);
            });
    }
    function auth() {
        goto("/auth/login");
    }
</script>

<button on:click={auth}>Auth</button>
<button on:click={testFetch}>Test Fetch</button>

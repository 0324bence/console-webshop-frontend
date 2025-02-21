<script lang="ts">
    import type { localComment, User } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import Comment from "./Comment.svelte";

    export let comment: localComment;
    export let observer: boolean = false;
    export let token: string | null = null;
    export let currentUser: User | null = null;
    let depthCounter: number = 1;

    const dispatch = createEventDispatcher<{
        intersect: void;
    }>();

    function handleIntersect() {
        dispatch("intersect");
    }
</script>

<Comment {comment} {observer} {token} {currentUser} {depthCounter} on:intersect={handleIntersect} />

<script lang="ts">
    import type { Comment, localComment } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import IntersectionObserver from "./IntersectionObserver.svelte";
    import apiPath from "$lib/apiPath";

    export let comment: localComment;
    export let observer: boolean = false;

    const dispatch = createEventDispatcher<{
        intersect: void;
    }>();

    function handleIntersect() {
        dispatch("intersect");
    }

    function transformDate(date: Date) {
        //2021.01.01 12:00
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }

    let replies: localComment[] = [];

    async function getReplies() {
        const repliesReq = await fetch(`${apiPath}/adverts/${comment.advertId}/comments/${comment.id}/replies`);
        if (!repliesReq.ok) {
            console.error("Failed to fetch replies");
            return;
        }
        let localReplies = await repliesReq.json();
        for (let comment of localReplies) {
            comment.createdTime = new Date(comment.createdTime);
            const userReq = await fetch(`${apiPath}/user/${comment.userId}`);
            if (userReq.ok) {
                comment.user = await userReq.json();
            } else {
                comment.user = {
                    id: 0,
                    name: "Ismeretlen",
                    email: "Ismeretlen",
                    bio: "Ismeretlen",
                    picture: "",
                    regDate: new Date()
                };
            }
        }
        replies = localReplies;
    }

    function repliesButtonClicked() {
        if (replies.length === 0) {
            getReplies();
        } else {
            replies = [];
        }
    }

    console.log(comment);
</script>

<div class="comment">
    {#if observer}
        <IntersectionObserver on:intersect={handleIntersect} />
    {/if}
    <div class="collapse-button"></div>
    <div class="content">
        <div class="comment-header">
            <h3>{comment.user.name}</h3>
            <span>{transformDate(comment.createdTime)}</span>
        </div>
        <div class="comment-text">{comment.text}.</div>
        <div class="comment-actions">
            <button on:click={repliesButtonClicked}><span>+</span> 15 válasz</button>
            <button>Válasz küldése</button>
        </div>
        <div class="replies">
            {#each replies as reply}
                <svelte:self comment={reply} {observer} />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @import "$lib/styles/variables.scss";

    .comment {
        display: flex;
        align-items: stretch;

        .collapse-button {
            width: 2px;
            outline: none;
            border: none;
            background-color: $color-dark-blue;
            border-radius: 2px;
            // cursor: pointer;
            margin: 2px;

            // &:hover {
            //     background-color: lighten($color-dark-blue, 10%);
            // }

            // &:focus {
            //     background-color: lighten($color-dark-blue, 10%);
            // }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 5px;

            .comment-header {
                width: 100%;
                display: flex;
                justify-content: start;
                align-items: center;
                gap: 1rem;

                h3 {
                    font-size: 1.2rem;
                }

                span {
                    font-size: 0.8rem;
                    color: lighten($color-black, 40%);
                }
            }

            .comment-text {
                width: 100%;
                padding: 0.4rem;
                // border: 1px solid $color-black;
                white-space: pre-wrap;
                font-size: 1rem;
            }

            .comment-actions {
                width: 100%;
                display: flex;
                justify-content: start;
                gap: 1rem;

                button {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    font-size: 1rem;
                    color: lighten($color-black, 40%);

                    &:hover {
                        color: $color-dark-blue;
                    }

                    &:active {
                        font-size: 0.98rem;
                    }

                    span {
                        border: 1px solid lighten($color-black, 40%);
                        border-radius: 50%;
                        display: inline-block;
                        aspect-ratio: 1 / 1;
                        height: 100%;
                    }
                }
            }

            .replies {
                width: 100%;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>

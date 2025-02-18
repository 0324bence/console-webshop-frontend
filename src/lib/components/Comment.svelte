<script lang="ts">
    import type { Comment, localComment, User } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import IntersectionObserver from "./IntersectionObserver.svelte";
    import apiPath from "$lib/apiPath";

    export let comment: localComment;
    export let observer: boolean = false;
    export let token: string | null = null;
    export let currentUser: User | null = null;

    let commentValue: string = "";

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

    let replyCount = comment.replyCount;

    function repliesButtonClicked() {
        if (replies.length === 0) {
            getReplies();
        } else {
            replies = [];
        }
    }

    let isCommenting = false;

    async function sendComment() {
        if (token == null || token == "" || currentUser == null) {
            return;
        }

        const advertId = comment.advertId;
        const commentId = comment.id;

        const res = await fetch(`${apiPath}/adverts/${advertId}/comments/${commentId}/replies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                text: commentValue
            })
        });
        if (!res.ok) {
            console.error("Failed to send comment");
            return;
        }
        const data = await res.json();
        replies = [
            ...replies,
            {
                id: data.id,
                userId: currentUser.id,
                advertId: advertId,
                text: commentValue,
                createdTime: new Date(),
                user: currentUser,
                replyCount: 0
            } as localComment
        ];
        replyCount++;
        commentValue = "";
        isCommenting = false;
    }

    let commentText: HTMLTextAreaElement;

    $: commentText?.focus();
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
        <div class="comment-text">{comment.text}</div>
        <div class="comment-actions">
            {#if replyCount > 0}
                <button type="button" on:click={repliesButtonClicked}>
                    {#if replies.length > 0}
                        <span>&minus;</span>
                    {:else}
                        <span>+</span>
                    {/if}
                    {replyCount} válasz</button
                >
            {/if}
            <!-- <button on:click={repliesButtonClicked}><span>+</span> {comment.replyCount} válasz</button> -->
            {#if token != "" && token != null}
                <button
                    type="button"
                    on:click={async () => {
                        isCommenting = true;
                    }}>Válasz küldése</button
                >
            {/if}
        </div>
        {#if isCommenting}
            <div class="comment-textbox">
                <div class="collapse-button"></div>
                <div class="textarea-container">
                    <textarea
                        placeholder="Hozzászólás..."
                        autocorrect="on"
                        required
                        spellcheck="true"
                        maxlength="1000"
                        bind:value={commentValue}
                        bind:this={commentText}
                    ></textarea>
                    <div class="button-container">
                        <button
                            type="button"
                            on:click={() => {
                                isCommenting = false;
                                commentValue = "";
                            }}>Mégse</button
                        >
                        <button type="button" on:click={sendComment}>Küldés</button>
                    </div>
                </div>
            </div>
        {/if}
        <div class="replies">
            {#each replies as reply}
                <svelte:self comment={reply} {observer} {token} {currentUser} />
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

            .comment-textbox {
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

                .textarea-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: end;

                    textarea {
                        flex: 1;
                        padding: 0.4rem;
                        font-size: 1rem;
                        border: 1px solid $color-black;
                        border-radius: 5px;
                        width: 100%;
                        resize: none;
                        gap: 0.5rem;
                    }

                    .button-container {
                        display: flex;
                        justify-content: end;
                    }

                    button {
                        padding: 0.5rem 1rem;
                        border-radius: 15px;
                        border: 1px solid $color-dark-blue;
                        font-size: 1rem;
                        margin: 0.5rem;
                        cursor: pointer;
                        &.cancel {
                            background-color: $color-red;
                            color: $color-white;

                            &:hover {
                                background-color: lighten($color-red, 10%);
                                color: $color-white;
                            }
                        }

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
            }

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

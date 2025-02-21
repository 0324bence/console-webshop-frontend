<script lang="ts">
    import type { Comment, localComment, User } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import IntersectionObserver from "./IntersectionObserver.svelte";
    import apiPath from "$lib/apiPath";
    import placeholder from "$lib/images/placeholder.png";

    export let comment: localComment;
    export let observer: boolean = false;
    export let token: string | null = null;
    export let currentUser: User | null = null;
    export let depthCounter: number;

    let commentValue: string = "";

    const dispatch = createEventDispatcher<{
        intersect: void;
    }>();

    function handleIntersect() {
        dispatch("intersect");
    }

    function transformDate(date: Date) {
        //YYYY.MM.DD. HH:MM with padding to 2 characters
        return `${date.getFullYear()}.
        ${(date.getMonth() + 1).toString().padStart(2, "0")}.
        ${date.getDate().toString().padStart(2, "0")}.
        ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }

    let replies: localComment[] = [];

    async function getReplies(offset: number) {
        const repliesReq = await fetch(
            `${apiPath}/adverts/${comment.advertId}/comments/${comment.id}/replies?count=20&skip=${offset}`
        );
        if (!repliesReq.ok) {
            console.error("Failed to fetch replies");
            return;
        }
        let localReplies = (await repliesReq.json()).items;
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
                    picture: placeholder,
                    regDate: new Date()
                };
            }
        }
        replies = [...replies, ...localReplies];
    }

    let replyCount = comment.replyCount;

    function repliesButtonClicked() {
        if (replies.length === 0) {
            getReplies(0);
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
            <div
                class="picture"
                style={`background-image: url('data:image/jpeg;base64,${comment.user.picture}')`}
            ></div>
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
            {#if token != "" && token != null && depthCounter < 10}
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
            {#each replies as reply, index}
                <svelte:self
                    comment={reply}
                    observer={(index + 1 + 5) % 20 == 0}
                    {token}
                    {currentUser}
                    depthCounter={depthCounter + 1}
                    on:intersect={() => {
                        getReplies(replies.length);
                    }}
                />
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
                gap: 0.5rem;

                .picture {
                    height: 100%;
                    aspect-ratio: 1 / 1;
                    border-radius: 50%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                h3 {
                    font-size: 1.2rem;
                }

                span {
                    margin-left: 0.5rem;
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
                word-break: break-word;
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

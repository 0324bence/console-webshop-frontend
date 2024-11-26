<script lang="ts">
    import { enhance } from "$app/forms";
    import arrayBufferToBase64 from "$lib/arrayBufferToBase64";
        let binary = "";
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    let imageFiles: string[] = [];

    async function handleFiles(event: Event | DragEvent) {
        event.preventDefault();

        const target = event.target as HTMLInputElement;

        let eventFiles: FileList | null | undefined;

        if (event instanceof DragEvent) {
            eventFiles = event.dataTransfer?.files;
        } else {
            eventFiles = target.files;
        }

        if (!eventFiles) return;

        imageFiles = [];
        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles[i];
            const base64 = await file.arrayBuffer().then(buffer => arrayBufferToBase64(buffer));
            let localFiles = [];
            localFiles.push(base64);
            imageFiles = [...imageFiles, ...localFiles];
            console.log(imageFiles);
        }
    }
</script>

<form
    method="post"
    use:enhance={({ formData, cancel }) => {
        for (const key in imageFiles) {
            formData.append("filelist", imageFiles[key]);
        }
        return;
    }}
    enctype="multipart/form-data"
>
    <input type="file" name="test" id="test" accept=".jpg,.png,.webp,.gif,.avif" multiple on:change={handleFiles} />
    <button type="submit">asd</button>
    {#each imageFiles as image}
        <img src={"data:image/jpeg;base64," + image} alt="kép" />
    {/each}
</form>

<style>
    img {
        width: 100px;
        height: 100px;
    }
</style>

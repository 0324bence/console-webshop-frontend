<script lang="ts">
    import { enhance } from "$app/forms";
    import arrayBufferToBase64 from "$lib/arrayBufferToBase64";
    import { onMount } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import apiPath from "$lib/apiPath";

    export let data: PageData;
    export let form: ActionData;

    let brandId: number = Number(form?.manufacturer) || 1;

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

    let manufacturerForm: HTMLFormElement;

    function manufacturerSelect() {
        manufacturerForm.submit();
    }

    console.log(form);

    onMount(() => {
        fetch(`${apiPath}/filters/locations?query=b`)
            .then(response => response.json())
            .then(data => console.log(data));
    });
</script>

<form
    action="?/submit"
    method="post"
    use:enhance={({ formData, cancel }) => {
        for (const key in imageFiles) {
            formData.append("filelist", imageFiles[key]);
        }
        return;
    }}
    enctype="multipart/form-data"
>
    <label for="title">Cím</label>
    <input type="text" name="title" id="title" />

    <label for="description">Leírás</label>
    <textarea name="description" id="description"></textarea>

    <label for="locationId">Település</label>
    <select name="locationId" id="locationId">
        <option value="1614">Kiskunfélegyháza</option>
    </select>

    <label for="priceHuf">Ár</label>
    <input name="priceHuf" type="number" id="priceHuf" />

    <label for="stateId">Állapot</label>
    <select name="stateId" id="stateId">
        {#each data.filters.states as state}
            <option value={state.id}>{state.name}</option>
        {/each}
    </select>

    <form action="?/manufacturer" method="post" bind:this={manufacturerForm}>
        <label for="brandId">Gyártó</label>
        <select bind:value={brandId} name="brandId" id="brandId" on:change={manufacturerSelect}>
            {#each data.filters.manufacturers as manufacturer}
                <option value={manufacturer.id}>{manufacturer.name}</option>
            {/each}
        </select>
    </form>

    <label for="modelId">Modell</label>
    <select name="modelId" id="modelId">
        {#each form?.models || [] as model}
            <option value={model.id}>{model.name}</option>
        {/each}
    </select>

    <label for="revision">Revízió</label>
    <input name="revision" type="text" id="revision" />

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

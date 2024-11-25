import { type Actions, fail, redirect } from "@sveltejs/kit";
import apiPath from "$lib/apiPath";

export const actions = {
    default: async ({ cookies, request }) => {
        console.log("default");
        const data = await request.formData();
        const files = data.getAll("filelist");

        console.log(files[0]);

        // console.log(base64);
    }
} satisfies Actions;

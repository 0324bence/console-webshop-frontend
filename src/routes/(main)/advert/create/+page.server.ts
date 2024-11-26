import { fail, redirect } from "@sveltejs/kit";
import apiPath from "$lib/apiPath";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params }) => {};

export const actions = {
    submit: async ({ cookies, request }) => {
        console.log("default");
        const data = await request.formData();
        const files = data.getAll("filelist");

        console.log(files[0]);

        // console.log(base64);
    },
    manufacturer: async ({ cookies, request }) => {
        console.log("manufacturer");
        const data = await request.formData();
        const brand = data.get("brandId");

        const res = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${brand}`);
        const body = await res.json();

        if (res.status == 200) {
            console.log(body);
            return {
                manufacturer: brand?.toString(),
                models: body
            };
        }
    }
} satisfies Actions;

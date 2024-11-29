import { fail, redirect } from "@sveltejs/kit";
import apiPath from "$lib/apiPath";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params }) => {};

export const actions = {
    submit: async ({ cookies, request }) => {
        const token = cookies.get("token");
        const data = await request.formData();
        const files = data.getAll("filelist");
        const title = data.get("title");
        const description = data.get("description");
        const locationId = data.get("locationId");
        const priceHuf = data.get("priceHuf");
        const stateId = data.get("stateId");
        const brandId = data.get("brandId");
        const modelId = data.get("modelId");
        const revision = data.get("revision");

        const body = {
            title,
            description,
            locationId,
            priceHuf,
            stateId,
            brandId,
            modelId,
            revision
        };

        const req = await fetch(`${apiPath}/adverts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        const res = await req.json();
        console.log(res);
    },
    manufacturer: async ({ cookies, request }) => {
        console.log("manufacturer");
        const data = await request.formData();
        const brand = data.get("brandId");

        const res = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${brand}`);
        const body = await res.json();

        if (res.status == 200) {
            return {
                manufacturer: brand?.toString(),
                models: body
            };
        }
    }
} satisfies Actions;

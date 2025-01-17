import { fail, redirect } from "@sveltejs/kit";
import apiPath from "$lib/apiPath";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params }) => {};

export const actions = {
    submit: async ({ cookies, request }) => {
        const token = cookies.get("token");
        const data = await request.formData();
        const files = data.getAll("filelist") as string[];
        const title = data.get("title");
        const description = data.get("description");
        const locationId = data.get("locationId");
        const priceHuf = data.get("priceHuf");
        const stateId = data.get("stateId");
        const brandId = data.get("brandId");
        const modelId = data.get("modelId");
        const revision = data.get("revision");
        const mainPictureIndex = data.get("mainPictureIndex");
        let pictureDescriptions = [];
        for (let i = 0; i < files.length; i++) {
            pictureDescriptions.push(data.get(`image${i}desc`));
        }

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

        for (const index in files) {
            const file = files[index];
            const req = await fetch(`${apiPath}/adverts/${res.id}/pictures`, {
                method: "POST",
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: file,
                    description: pictureDescriptions[index]
                })
            });

            if (index == mainPictureIndex && req.ok) {
                const resp = await req.json();
                console.log("picId", resp.id);
                const primaryReq = await fetch(`${apiPath}/adverts/${res.id}/primaryPictureId`, {
                    method: "POST",
                    headers: {
                        authorization: "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        picId: resp.id
                    })
                });
            }
        }
        return redirect(302, `/advert/${res.id}`);
    }
} satisfies Actions;

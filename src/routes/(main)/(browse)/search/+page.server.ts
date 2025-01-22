import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    filters: async ({ request }) => {
        const data = await request.formData();

        //user
        const userId = data.get("userId");
        console.log(userId);
        let redirectUrl;
        if (userId !== null && userId !== "") {
            redirectUrl = `/profile/${userId}?`;
        } else {
            redirectUrl = "/?";
        }

        //states
        const states = data.getAll("state");
        const stateString = states.join(",");
        if (stateString.length > 0) {
            redirectUrl += `stateIds=${encodeURIComponent(stateString)}&`;
        }

        //manufacturers
        const manufacturers = data.getAll("manufacturer");
        const manufacturerString = manufacturers.join(",");
        if (manufacturerString.length > 0) {
            redirectUrl += `manufacturerIds=${encodeURIComponent(manufacturerString)}&`;
        }

        //models
        const models = data.getAll("model");
        const modelString = models.join(",");
        if (modelString.length > 0) {
            redirectUrl += `modelIds=${encodeURIComponent(modelString)}&`;
        }

        //title
        const title = data.get("title");
        if (title) {
            redirectUrl += `title=${encodeURIComponent(title.toString())}&`;
        }

        //location
        const location = data.get("location");
        if (location && location !== "") {
            redirectUrl += `locationId=${encodeURIComponent(location.toString())}&`;
        }

        //distance
        const distance = data.get("distance");
        if (distance && location && location !== "") {
            redirectUrl += `locationMaxDistance=${encodeURIComponent(distance.toString())}&`;
        }

        return redirect(303, redirectUrl);
    }
};

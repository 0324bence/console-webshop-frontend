import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    filters: async ({ request }) => {
        let redirectUrl = "/?";

        const data = await request.formData();

        //states
        const states = data.getAll("state");
        const stateString = states.join(",");
        if (stateString.length > 0) {
            redirectUrl += `stateIds=${stateString}&`;
        }

        //manufacturers
        const manufacturers = data.getAll("manufacturer");
        const manufacturerString = manufacturers.join(",");
        if (manufacturerString.length > 0) {
            redirectUrl += `manufacturerIds=${manufacturerString}&`;
        }

        //models
        const models = data.getAll("model");
        const modelString = models.join(",");
        if (modelString.length > 0) {
            redirectUrl += `modelIds=${modelString}&`;
        }

        return redirect(303, redirectUrl);
    }
};

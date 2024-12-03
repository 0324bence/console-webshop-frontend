import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    filters: async ({ request }) => {
        let redirectUrl = "/?";

        const data = await request.formData();
        const states = data.getAll("state");
        const stateString = states.join(",");

        if (stateString.length > 0) {
            redirectUrl += `stateIds=${stateString}`;
        }

        return redirect(303, redirectUrl);
    }
};

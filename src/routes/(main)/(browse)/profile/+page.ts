import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { ownUser } = await parent();
    if (ownUser === null) return redirect(303, "/auth");
    return redirect(303, `/profile/${ownUser.id}`);
};

import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { user } = await parent();
    return redirect(302, `/profile/${user.id}`);
};

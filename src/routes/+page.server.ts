import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
    const token = cookies.get("token");
    if (token === undefined) {
        return redirect(302, "/auth");
    }
    return redirect(302, "/browse");
};

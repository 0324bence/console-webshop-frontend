import { type Actions, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({}) => {
    return redirect(302, "/auth/login");
};

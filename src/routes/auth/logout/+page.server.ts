import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
    console.log(cookies);
    cookies.delete("token", { path: "/" });
    return redirect(302, "/");
};

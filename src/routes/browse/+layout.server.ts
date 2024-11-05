import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    return {
        token: token || null
    };
};

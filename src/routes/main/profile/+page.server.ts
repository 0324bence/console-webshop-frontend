import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (token === undefined) {
        return redirect(302, "/auth");
    }
    const route = apiPath + "/user/";
    const res = await fetch(route, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    if (res.status !== 200) {
        console.log("Failed to get own username");
        cookies.delete("token", { path: "/" });
        return redirect(302, "/auth");
    }
    const user = await res.json();
    return {
        token,
        user
    };
};

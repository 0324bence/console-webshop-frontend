import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { User } from "$lib/types/User";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    let user: User | null = null;
    if (token != undefined) {
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
        user = await res.json();
    }

    const basic = await fetch(apiPath + "/filters/basic");
    const basicData = await basic.json();

    if (basic.status !== 200) {
        console.log("Failed to get filters");
        return error(500, "Failed to get filters");
    }
    return {
        filters: basicData,
        token: token || null,
        ownUser: user
    };
};

import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { User } from "$lib/types/User";

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
    return {
        token: token || null,
        ownUser: user
    };
};

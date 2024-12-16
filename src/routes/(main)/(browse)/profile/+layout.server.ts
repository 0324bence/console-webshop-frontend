import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { User } from "$lib/types/";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (token === undefined) {
        return {
            ownUser: null
        };
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
        return {
            ownUser: null
        };
    }
    const user: User = await res.json();
    return {
        ownUser: user
    };
};

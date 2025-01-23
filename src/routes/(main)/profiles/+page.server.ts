import { type Actions, error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { User } from "$lib/types";
import userPlaceholder from "$lib/images/userPlaceholder";

export const load: PageServerLoad = async ({ url }) => {
    if (!url.searchParams.has("name")) return redirect(302, "/");
    const usersReq = await fetch(`${apiPath}/user/find?name=${url.searchParams.get("name")}`);
    if (!usersReq.ok) return error(usersReq.status, "Failed to load user<br>" + (await usersReq.text()));
    const users = (await usersReq.json()).items as User[];

    for (const user of users) {
        if (!user.picture) {
            user.picture = userPlaceholder;
        }
    }

    return {
        users
    };
};

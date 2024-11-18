import apiPath from "$lib/apiPath";
import type { User } from "$lib/types/User";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {
    if (params.id === undefined || isNaN(Number(params.id))) {
        return error(400, "Invalid user id");
    }

    const { ownUser } = await parent();

    if (Number(params.id) === ownUser.id) {
        return {
            user: ownUser
        };
    }

    try {
        const user: User = await fetch(`${apiPath}/user/${params.id}`).then(res => res.json());

        return {
            user
        };
    } catch {
        return error(404, "User not found");
    }
};

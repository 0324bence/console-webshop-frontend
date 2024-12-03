import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { User } from "$lib/types";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const advertsReq = await fetch(`${apiPath}/adverts${url.search}`);
    if (!advertsReq.ok) {
        return error(advertsReq.status, advertsReq.statusText);
    }
    const adverts = await advertsReq.json();

    //states
    const activeStates = url.searchParams.get("stateIds")?.split(",").map(Number) || [];

    return {
        activeFilters: {
            states: activeStates
        },
        adverts
    };
};

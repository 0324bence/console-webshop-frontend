import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { LocalAdvert, Picture } from "$lib/types";
import noImage from "$lib/images/noImage";
import getAdverts from "$lib/getAdverts";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const urlPath = url.pathname.split("/");
    urlPath.shift();
    if (urlPath[0] === "profile") {
        if (urlPath[1] === undefined) {
            return getAdverts(undefined, undefined);
        }
        return await getAdverts(url, parseInt(urlPath[1]));
    }
    return await getAdverts(url, undefined);
};

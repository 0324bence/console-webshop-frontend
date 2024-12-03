import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { LocalAdvert, Picture } from "$lib/types";
import noImage from "$lib/images/noImage";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const advertsReq = await fetch(`${apiPath}/adverts${url.search}`);
    if (!advertsReq.ok) {
        return error(advertsReq.status, advertsReq.statusText);
    }
    const advertsRes = await advertsReq.json();
    const adverts: LocalAdvert[] = advertsRes.items;
    for (const advert of adverts) {
        const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/pictures`);
        if (picturesReq.ok) {
            const pictures: Picture[] = await picturesReq.json();
            advert.pictures = pictures;
            advert.mainPicture = pictures.find(p => p.isPriority === 1) || pictures[0];
        } else {
            /*Todo convert nincs kép to base64*/
            advert.pictures = [
                {
                    id: 0,
                    data: noImage,
                    description: "Nincs megadva kép",
                    advertId: advert.id,
                    isPriority: 1
                }
            ];
            advert.mainPicture = advert.pictures[0];
        }
    }

    //states
    const activeStates = url.searchParams.get("stateIds")?.split(",").map(Number) || [];

    return {
        activeFilters: {
            states: activeStates
        },
        adverts
    };
};

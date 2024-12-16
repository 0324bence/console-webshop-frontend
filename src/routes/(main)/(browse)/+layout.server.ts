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
        const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/primaryPicture`);
        if (picturesReq.ok) {
            let pictures: Picture = await picturesReq.json();
            advert.mainPicture = pictures;
        } else {
            // advert.pictures = [
            // {
            //     id: 0,
            //     data: noImage,
            //     description: "Nincs megadva kép",
            //     advertId: advert.id,
            //     isPriority: 1
            // }
            // ];
            advert.mainPicture = {
                id: 0,
                data: noImage,
                description: "Nincs megadva kép",
                advertId: advert.id,
                isPriority: 1
            };
        }
    }

    //states
    const activeStates = url.searchParams.get("stateIds")?.split(",").map(Number) || [];

    //manufacturers
    const activeManufacturers = url.searchParams.get("manufacturerIds")?.split(",").map(Number) || [];

    //models
    const activeModels = url.searchParams.get("modelIds")?.split(",").map(Number) || [];

    return {
        activeFilters: {
            states: activeStates,
            manufacturers: activeManufacturers,
            models: activeModels
        },
        adverts
    };
};

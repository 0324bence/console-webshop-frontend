import apiPath from "$lib/apiPath";
import noImage from "$lib/images/noImage";
import type { LocalAdvert, Location, Picture, User } from "$lib/types";
import { error } from "@sveltejs/kit";

async function getAdverts(
    url: URL | undefined,
    userId: number | undefined
): Promise<{
    activeFilters: {
        states: number[];
        manufacturers: number[];
        models: number[];
        title: string;
        sortBy: string;
        sortOrder: string;
        location: Location | undefined;
        distance: number;
    };
    adverts: LocalAdvert[];
    advertCount?: number;
}> {
    if (url === undefined) {
        return {
            activeFilters: {
                states: [],
                manufacturers: [],
                models: [],
                title: "",
                sortBy: "",
                sortOrder: "",
                location: undefined,
                distance: 0
            },
            adverts: []
        };
    }
    let advertsReq;
    if (userId !== undefined) {
        advertsReq = await fetch(
            `${apiPath}/adverts${url.search}${url.search.length > 0 ? "&" : "?"}ownerId=${userId}`
        );
    } else {
        advertsReq = await fetch(`${apiPath}/adverts${url.search}`);
    }
    if (!advertsReq.ok) {
        return error(advertsReq.status, "Error getting adverts: " + advertsReq.statusText);
    }
    const advertsRes = await advertsReq.json();
    const adverts: LocalAdvert[] = advertsRes.items;
    const advertCount = parseInt(advertsRes.resultCount);
    for (const advert of adverts) {
        const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/primaryPicture`);
        if (picturesReq.ok) {
            try {
                let pictures: Picture = await picturesReq.json();
                advert.mainPicture = pictures;
            } catch (error) {
                advert.mainPicture = {
                    id: 0,
                    data: noImage,
                    description: "Nincs megadva kép",
                    advertId: advert.id,
                    isPriority: 1
                };
            }
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
        const locationReq = await fetch(`${apiPath}/filters/locations/${advert.locationId}`);
        if (locationReq.ok) {
            advert.location = await locationReq.json();
        } else {
            advert.location = {
                id: 0,
                name: "Ismeretlen",
                county: "Ismeretlen",
                zip: 0,
                latitude: "0",
                longitude: "0"
            };
        }
    }

    //states
    const activeStates = url.searchParams.get("stateIds")?.split(",").map(Number) || [];

    //manufacturers
    const activeManufacturers = url.searchParams.get("manufacturerIds")?.split(",").map(Number) || [];

    //models
    const activeModels = url.searchParams.get("modelIds")?.split(",").map(Number) || [];

    //title
    const title = url.searchParams.get("title") || "";

    //sortBy
    const sortBy = url.searchParams.get("sortBy") || "";

    //sortOrder
    const sortOrder = url.searchParams.get("sortOrder") || "";

    //distance
    const distance = parseInt(url.searchParams.get("locationMaxDistance") || "0");

    let location: Location | undefined;
    if (url.searchParams.get("locationId") !== null) {
        const loactionReq = await fetch(`${apiPath}/filters/locations/${url.searchParams.get("locationId")}`);
        if (loactionReq.ok) {
            location = await loactionReq.json();
        } else {
            location = undefined;
        }
    } else {
        location = undefined;
    }

    return {
        activeFilters: {
            states: activeStates,
            manufacturers: activeManufacturers,
            models: activeModels,
            title,
            sortBy,
            sortOrder,
            location,
            distance
        },
        adverts,
        advertCount
    };
}

export default getAdverts;

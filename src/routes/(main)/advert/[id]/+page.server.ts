import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { LocalAdvert, Picture } from "$lib/types";
import noImage from "$lib/images/noImage";

export const load: PageServerLoad = async ({ params, parent, url }) => {
    if (params.id === undefined || isNaN(Number(params.id))) {
        return error(400, "Nem megfelelő paraméterek");
    }

    const advertReq = await fetch(`${apiPath}/adverts/${params.id}`);
    if (!advertReq.ok || advertReq.status !== 200) {
        return error(404, "Advert not found");
    }

    const advertRes = await advertReq.json();
    const advert: LocalAdvert = advertRes;
    const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/pictures`);
    if (picturesReq.ok) {
        try {
            let pictures: Picture[] = await picturesReq.json();
            console.log(pictures, typeof pictures);
            if (pictures.length === 0) {
                advert.pictures = [
                    {
                        id: 0,
                        data: noImage,
                        description: "Nincs megadva kép",
                        advertId: advert.id,
                        isPriority: 1
                    }
                ];
            } else {
                advert.pictures = pictures;
                let mainPicture = pictures.find(picture => picture.isPriority === 1);
                if (mainPicture === undefined) {
                    mainPicture = pictures[0];
                } else {
                    advert.mainPicture = mainPicture;
                }
            }
        } catch (error) {
            advert.pictures = [
                {
                    id: 0,
                    data: noImage,
                    description: "Nincs megadva kép",
                    advertId: advert.id,
                    isPriority: 1
                }
            ];
        }
    } else {
        advert.pictures = [
            {
                id: 0,
                data: noImage,
                description: "Nincs megadva kép",
                advertId: advert.id,
                isPriority: 1
            }
        ];
    }
    if (advert.pictures.length === 1) {
        advert.mainPicture = advert.pictures[0];
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

    return {
        advert
    };
};

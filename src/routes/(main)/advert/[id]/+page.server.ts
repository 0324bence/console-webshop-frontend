import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { LocalAdvert, Manufacturer, Model, Picture, User } from "$lib/types";
import noImage from "$lib/images/noImage";

interface ExtendedLocalAdvert extends LocalAdvert {
    owner: User;
    manufacturer: Manufacturer;
    model: Model;
}

export const load: PageServerLoad = async ({ params, parent, url }) => {
    if (params.id === undefined || isNaN(Number(params.id))) {
        return error(400, "Nem megfelelő paraméterek");
    }

    const advertReq = await fetch(`${apiPath}/adverts/${params.id}`);
    if (!advertReq.ok || advertReq.status !== 200) {
        return error(404, "Advert not found");
    }

    const data = await parent();

    const advertRes = await advertReq.json();
    const advert: ExtendedLocalAdvert = advertRes;
    const picturesReq = await fetch(`${apiPath}/adverts/${advert.id}/pictures`);
    if (picturesReq.ok) {
        try {
            let pictures: Picture[] = await picturesReq.json();
            // console.log(pictures, typeof pictures);
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
                // console.log(mainPicture);
                if (mainPicture == undefined) {
                    advert.mainPicture = pictures[0];
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
    const ownerReq = await fetch(`${apiPath}/user/${advert.ownerId}`);
    if (ownerReq.ok) {
        advert.owner = await ownerReq.json();
    } else {
        advert.owner = {
            id: 0,
            name: "Ismeretlen",
            email: "Ismeretlen",
            bio: "Ismeretlen",
            picture: "",
            regDate: new Date()
        };
    }

    const manufacturerReq = await fetch(`${apiPath}/filters/manufacturerOfModel?modelId=${advert.modelId}`);
    if (manufacturerReq.ok) {
        advert.manufacturer = await manufacturerReq.json();
    } else {
        advert.manufacturer = {
            id: 0,
            name: "Ismeretlen"
        };
    }
    let models: Model[] = [];
    const modelReq = await fetch(`${apiPath}/filters/modelsForManufacturer?manufacturerId=${advert.manufacturer.id}`);
    if (advert.manufacturer.id !== 0 && modelReq.ok) {
        models = await modelReq.json();
        // console.log(models);
        advert.model = models.find(model => model.id === advert.modelId)!;
    } else {
        advert.model = {
            id: 0,
            name: "Ismeretlen",
            manufacturerId: 0
        };
    }

    // advert.manufacturer = data.filters.manufacturers.find(manufacturer => manufacturer.id === advert.manufacturerId)!;

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
    // console.log(advert);

    let isOwn = false;
    if (data.ownUser !== null) {
        isOwn = data.ownUser.id === advert.ownerId;
    }

    return {
        advert,
        models,
        isOwn
    };
};

export const actions = {
    editData: async ({ cookies, request, params }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const id = params.id;
        const data = await request.formData();
        /*data structure:{
            title	string
            description	string
            locationId	number
            priceHuf	number
            stateId	number
            modelId	number
        }*/
        const title = data.get("title");
        const locationId = data.get("locationId");
        const priceHuf = data.get("priceHuf");
        const stateId = data.get("stateId");
        const modelId = data.get("modelId");

        const body = {
            title,
            locationId,
            priceHuf,
            stateId,
            modelId
        };

        const res = await fetch(`${apiPath}/adverts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            return "ok";
        } else {
            return error(500, "Hiba történt az adatok mentése közben");
        }
    },
    editPicture: async ({ cookies, request }) => {}
} satisfies Actions;

import apiPath from "$lib/apiPath";
import type { CartItem, LocalAdvert, Manufacturer, Model, Picture, User } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import noImage from "$lib/images/noImage";
import placeholder from "$lib/images/placeholder.png";

interface ExtendedLocalAdvert extends LocalAdvert {
    owner: User;
    manufacturer: Manufacturer;
    model: Model;
}

export const load: PageServerLoad = async ({ cookies, parent }) => {
    const data = await parent();

    const res = await fetch(`${apiPath}/cart`, {
        headers: {
            Authorization: "Bearer " + data.token,
            "Content-Type": "application/json"
        }
    });
    const cart: CartItem[] = await res.json();

    let adverts: ExtendedLocalAdvert[] = [];

    for (const item of cart) {
        const advertReq = await fetch(`${apiPath}/adverts/${item.advertId}`);
        if (!advertReq.ok || advertReq.status !== 200) {
            return error(404, "Advert not found");
        }

        const data = await parent();

        const advertRes = await advertReq.json();
        const advert: ExtendedLocalAdvert = advertRes;
        const pictureReq = await fetch(`${apiPath}/adverts/${advert.id}/primaryPicture`);
        if (pictureReq.ok) {
            try {
                let picture: Picture = await pictureReq.json();
                // console.log(pictures, typeof pictures);
                if (picture == undefined) {
                    advert.mainPicture = {
                        id: 0,
                        data: noImage,
                        description: "Nincs megadva kép",
                        advertId: advert.id,
                        isPriority: 1
                    };
                } else {
                    advert.mainPicture = picture;
                }
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
            advert.mainPicture = {
                id: 0,
                data: noImage,
                description: "Nincs megadva kép",
                advertId: advert.id,
                isPriority: 1
            };
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
                picture: placeholder,
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
        const modelReq = await fetch(
            `${apiPath}/filters/modelsForManufacturer?manufacturerId=${advert.manufacturer.id}`
        );
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

        adverts.push(advert);
    }

    return {
        adverts
    };
};

export const actions = {
    deleteItem: async ({ cookies, request }) => {
        const token = cookies.get("token");
        const data = await request.formData();
        const advertId = data.get("advertId");
        const res = await fetch(`${apiPath}/cart/${advertId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            return res.json();
        }
    },
    purchase: async ({ cookies, request }) => {
        const token = cookies.get("token");
        const res = await fetch(`${apiPath}/cart/purchase`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            const edata = await res.json();
            return error(res.status, edata.message);
        }
        return redirect(301, "/history");
    }
} satisfies Actions;

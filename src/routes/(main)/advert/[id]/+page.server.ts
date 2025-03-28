import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import type { Comment, LocalAdvert, Manufacturer, Model, Picture, User, localComment } from "$lib/types";
import noImage from "$lib/images/noImage";
import placeholder from "$lib/images/userPlaceholder";

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

    const commentsReq = await fetch(`${apiPath}/adverts/${advert.id}/comments/direct?count=20`);
    let comments: localComment[] = [];
    let commentCount = 0;
    if (commentsReq.ok) {
        const commentJSON = await commentsReq.json();
        comments = commentJSON.items;
        commentCount = commentJSON.resultCount;
        for (let comment of comments) {
            comment.createdTime = new Date(comment.createdTime);
            const userReq = await fetch(`${apiPath}/user/${comment.userId}`);
            if (userReq.ok) {
                comment.user = await userReq.json();
            } else {
                comment.user = {
                    id: 0,
                    name: "Ismeretlen",
                    email: "Ismeretlen",
                    bio: "Ismeretlen",
                    picture: placeholder,
                    regDate: new Date()
                };
            }
        }
    }

    let inCart = false;
    const cartReq = await fetch(`${apiPath}/cart/${advert.id}`, {
        headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json"
        }
    });
    if (cartReq.ok) {
        inCart = true;
    } else {
        inCart = false;
    }

    let inBookmarks = false;
    const bookmarksReq = await fetch(`${apiPath}/bookmarks/${advert.id}`, {
        headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json"
        }
    });
    if (bookmarksReq.ok) {
        inBookmarks = true;
    } else {
        inBookmarks = false;
    }

    let isOwn = false;
    if (data.ownUser !== null) {
        isOwn = data.ownUser.id === advert.ownerId;
    }

    let editable = false;
    if (isOwn) {
        const inCartReq = await fetch(`${apiPath}/adverts/${advert.id}/isInCart`, {
            headers: {
                Authorization: `Bearer ${data.token}`,
                "Content-Type": "application/json"
            }
        });
        if (inCartReq.ok) {
            const inCartJSON = await inCartReq.json();
            editable = !inCartJSON.result;
        }
    }

    const isSold = advert.isSold == 1;

    return {
        advert,
        models,
        isOwn,
        inCart,
        inBookmarks,
        comments,
        commentCount,
        editable,
        isSold
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
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
    },
    editPicture: async ({ cookies, request, params }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;
        const data = await request.formData();
        const id = data.get("image");
        const description = data.get("description");
        const isPriority = data.get("isPriority");
        console.log(id, description, isPriority);
        const body = {
            description
        };
        if (isPriority == "1") {
            const primaryReq = await fetch(`${apiPath}/adverts/${advertId}/primaryPictureId`, {
                method: "POST",
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    picId: id
                })
            });
            if (!primaryReq.ok) {
                const data = await primaryReq.json();
                return error(data.statusCode, data.message);
            }
        }
        const res = await fetch(`${apiPath}/adverts/${advertId}/pictures/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                ...body
            })
        });
        if (res.ok) {
            return "ok";
        } else {
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
    },
    addPicture: async ({ cookies, request, params }) => {
        console.log("addPicture");
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;
        const data = await request.formData();
        const file = data.get("image-data") as string;
        const description = data.get("description");
        const isPriority = data.get("isPriority");

        const body = {
            data: file,
            description
        };
        const res = await fetch(`${apiPath}/adverts/${advertId}/pictures`, {
            method: "POST",
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
        if (isPriority == "1") {
            const resp = await res.json();
            const primaryReq = await fetch(`${apiPath}/adverts/${advertId}/primaryPictureId`, {
                method: "POST",
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    picId: resp.id
                })
            });
            if (!primaryReq.ok) {
                const data = await primaryReq.json();
                return error(data.statusCode, data.message);
            }
        }
        return "ok";
    },
    deletePicture: async ({ cookies, request, params }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const data = await request.formData();
        const advertId = params.id;
        const pictureId = data.get("image");

        const res = await fetch(`${apiPath}/adverts/${advertId}/pictures/${pictureId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
    },
    addToCart: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;

        const res = await fetch(`${apiPath}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                advertId
            })
        });
    },
    removeFromCart: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;
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
    addToBookmarks: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;

        const res = await fetch(`${apiPath}/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                advertId
            })
        });
    },
    removeFromBookmarks: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;

        const res = await fetch(`${apiPath}/bookmarks/${advertId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
    },
    addComment: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;
        const data = await request.formData();
        const text = data.get("comment");

        const res = await fetch(`${apiPath}/adverts/${advertId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                text
            })
        });
        if (!res.ok) {
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
    },
    addCommentToComment: async ({ cookies, params, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return redirect(301, "/auth/");
        }
        const advertId = params.id;
        const data = await request.formData();
        const text = data.get("comment");
        const commentId = data.get("commentId");

        console.log("addCommentToComment", advertId, commentId, text);

        const res = await fetch(`${apiPath}/adverts/${advertId}/comments/${commentId}/replies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                text
            })
        });
        if (!res.ok) {
            const data = await res.json();
            return error(data.statusCode, data.message);
        }
        return "ok";
    }
} satisfies Actions;

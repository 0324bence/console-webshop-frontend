import apiPath from "$lib/apiPath";
import type { LocalAdvert, Picture, User } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import noImage from "$lib/images/noImage";
import getAdverts from "$lib/getAdverts";

export const load: PageServerLoad = async ({ params, parent, url }) => {
    if (params.id === undefined || isNaN(Number(params.id))) {
        return error(400, "Invalid user id");
    }

    const { ownUser } = await parent();

    if (ownUser !== null && Number(params.id) === ownUser.id) {
        return {
            isOwn: true,
            user: ownUser
            // ...(await getAdverts(url, ownUser))
        };
    }

    try {
        const req = await fetch(`${apiPath}/user/${params.id}`);

        if (!req.ok) {
            const json = await req.json();
            let message = "";
            if (typeof json.message === "string") {
                message = json.message;
            } else {
                message = json.message[0].message;
            }
            return error(req.status, message);
        }
        const user: User = await req.json();

        return {
            isOwn: false,
            user
            // ...(await getAdverts(url, user))
        };
    } catch {
        return error(404, "User not found");
    }
};

export const actions = {
    picture: async ({ cookies, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return error(401, "Unauthorized");
        }

        const data = await request.formData();
        const file = data.get("file") as File;
        if (file === null) {
            return error(400, "No file provided");
        }
        const base64 = await file.arrayBuffer().then(buffer => Buffer.from(buffer).toString("base64"));

        const req = await fetch(`${apiPath}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                picture: base64
            })
        });
        if (!req.ok) {
            const json = await req.json();
            let message = "";
            if (typeof json.message === "string") {
                message = json.message;
            } else {
                message = json.message[0].message;
            }
            return error(req.status, message);
        }
        return "ok";
    },
    bio: async ({ cookies, request }) => {
        const token = cookies.get("token");
        if (token === undefined) {
            return error(401, "Unauthorized");
        }

        const data = await request.formData();
        const bio = data.get("editedBio");
        if (bio === null) {
            return error(400, "No bio provided");
        }

        const req = await fetch(`${apiPath}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                bio
            })
        });
        if (!req.ok) {
            const json = await req.json();
            console.log(json);
            let message = "";
            if (typeof json.message === "string") {
                message = json.message;
            } else {
                message = json.message[0];
            }
            return error(req.status, message);
        }
        return "ok";
    }
} satisfies Actions;

import apiPath from "$lib/apiPath";
import type { User } from "$lib/types/User";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {
    if (params.id === undefined || isNaN(Number(params.id))) {
        return error(400, "Invalid user id");
    }

    const { ownUser } = await parent();

    if (Number(params.id) === ownUser.id) {
        return {
            isOwn: true,
            user: ownUser
        };
    }

    try {
        const req = await fetch(`${apiPath}/user/${params.id}`);

        if (!req.ok) {
            return error(req.status, (await req.json())["message"]);
        }
        const user: User = await req.json();

        return {
            isOwn: false,
            user
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
            return error(req.status, (await req.json())["message"]);
        }
        return "ok";
    }
} satisfies Actions;
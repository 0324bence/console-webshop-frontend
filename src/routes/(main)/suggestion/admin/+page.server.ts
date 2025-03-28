import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import apiPath from "$lib/apiPath";
import placeholder from "$lib/images/placeholder.png";
import type { ExtendedSuggestion, Suggestion } from "$lib/types";

export const load: PageServerLoad = async ({ parent }) => {
    const data = await parent();
    if (data.ownUser == null) {
        return redirect(302, "/auth");
    }
    if (!data.ownUser?.isAdmin) {
        return redirect(302, "/suggestion/");
    }
    const req = await fetch(`${apiPath}/suggestions`, {
        headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json"
        }
    });
    const suggestions = (await req.json()).items as ExtendedSuggestion[];
    for (const suggestion of suggestions) {
        suggestion.createdTime = new Date(suggestion.createdTime);
        const ownerReq = await fetch(`${apiPath}/user/${suggestion.userId}`);
        if (ownerReq.ok) {
            suggestion.user = await ownerReq.json();
        } else {
            suggestion.user = {
                id: 0,
                name: "Ismeretlen",
                email: "Ismeretlen",
                bio: "Ismeretlen",
                picture: placeholder,
                regDate: new Date(),
                isAdmin: false,
                rating: 0
            };
        }
    }
    return { suggestions };
};

import apiPath from "$lib/apiPath";

export const actions = {
    suggestion: async ({ cookies, request }) => {
        const token = cookies.get("token");
        const data = await request.formData();
        const text = data.get("text");
        const title = data.get("title");
        const res = await fetch(`${apiPath}/suggestions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                title
            })
        });
        if (!res.ok) {
            return "ok";
        }
    }
};

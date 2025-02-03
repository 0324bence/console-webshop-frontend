import { type Actions, fail, redirect } from "@sveltejs/kit";
import apiPath from "$lib/apiPath";

export const actions = {
    login: async ({ cookies, request }) => {
        //TODO debug
        const data = await request.formData();
        const username = data.get("name");
        const password = data.get("password");

        if (username === null || password === null) return { message: "Invalid input" };

        const res = await fetch(`${apiPath}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                password
            })
        });

        const body = await res.json();

        console.log("login res body:", body);

        if (res.status == 201) {
            //TODO
            cookies.set("token", body.access_token, {
                path: "/",
                maxAge: 60 * 60,
                httpOnly: true,
                sameSite: "strict",
                secure: false
            });
            console.log("login body:", body);
            return redirect(302, "/");
        }
        return { message: body.message };
    },
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("name");
        const password = data.get("password");
        const email = data.get("email");

        console.log(username, password, email);

        if (username === null || password === null || email === null) return { message: "Invalid input" };

        console.log(`${apiPath}/user/create`);

        const res = await fetch(`${apiPath}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                password,
                email
            })
        });
        if (res.ok || res.status == 201) {
            return redirect(302, "/auth");
        }
        const body = await res.json();
        return { message: body.message };
    }
} satisfies Actions;

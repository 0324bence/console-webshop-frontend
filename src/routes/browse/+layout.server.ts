import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import apiPath from "$lib/apiPath";

// export const load: LayoutServerLoad = async ({ cookies }) => {
//     const token = cookies.get("token");
//     if (token === undefined) {
//         return redirect(302, "/auth");
//     }
//     return {
//         token
//     };
// };

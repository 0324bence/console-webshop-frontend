import {error, type Page} from '@sveltejs/kit';
import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/auth/[action]/$types";


export const load: PageLoad = ({ params }) => {
    if (params.action === 'login' || params.action === 'register') {
        return {
            action: params.action
        };
    }

    error(404, 'Not found');
};
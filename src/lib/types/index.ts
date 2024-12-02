interface User {
    id: number;
    name: string;
    email: string | undefined;
    bio: string;
    picture: string;
    regDate: Date;
}

interface Model {
    id: number;
    name: string;
    manufacturerId: number;
}

export type { User, Model };

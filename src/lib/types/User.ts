interface User {
    id: number;
    name: string;
    email: string | undefined;
    bio: string;
    picture: string;
    regDate: Date;
}

export type { User };

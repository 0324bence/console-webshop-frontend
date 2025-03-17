interface User {
    id: number;
    name: string;
    email: string | undefined;
    bio: string;
    picture: string;
    regDate: Date;
    rating: number;
}

interface Model {
    id: number;
    name: string;
    manufacturerId: number;
}

interface Advert {
    id: number;
    title: string;
    ownerId: number;
    description: string;
    locationId: number;
    priceHuf: number;
    stateId: number;
    modelId: number;
    revision: string;
    viewCount: number;
    isSold: number;
    createdTime: string;
}

interface Picture {
    id: number;
    data: string;
    description: string;
    advertId: number;
    isPriority: 1 | 0;
}

interface LocalAdvert extends Advert {
    pictures: Picture[];
    location: Location;
    mainPicture: Picture;
}

interface Location {
    id: number;
    name: string;
    county: string;
    zip: number;
    latitude: string;
    longitude: string;
}

interface Manufacturer {
    id: number;
    name: string;
}

interface State {
    id: number;
    name: string;
}

interface BasicFilters {
    manufacturers: Manufacturer[];
    states: State[];
}

interface CartItem {
    userId: number;
    advertId: number;
}

interface Comment {
    id: number;
    userId: number;
    advertId: number;
    text: string;
    replyToId: number | null;
    createdTime: Date;
    replyCount: number;
}

interface localComment extends Comment {
    user: User;
}

interface PurchaseItem {
    id: number;
    userId: number;
    advertId: number;
    createdTime: string;
    rating: number | null;
}

export type {
    User,
    Model,
    Advert,
    Picture,
    LocalAdvert,
    Location,
    Manufacturer,
    State,
    BasicFilters,
    CartItem,
    Comment,
    localComment,
    PurchaseItem
};

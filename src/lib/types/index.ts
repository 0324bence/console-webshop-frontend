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

export type { User, Model, Advert, Picture, LocalAdvert, Location, Manufacturer, State, BasicFilters };

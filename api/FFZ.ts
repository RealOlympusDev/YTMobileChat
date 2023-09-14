export interface FFZEmote {
    id:        number;
    user:      User;
    code:      string;
    images:    Images;
    imageType: string;
}
export interface Images {
    "1x": string;
    "2x": null | string;
    "3x": null | string;
    "4x": null | string;
}

export interface User {
    id:          number;
    name:        string;
    displayName: string;
}
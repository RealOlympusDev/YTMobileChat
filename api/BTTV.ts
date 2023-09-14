export interface BTTVEmotes {
    id:            string;
    bots:          string[];
    avatar:        string;
    channelEmotes: Emote[];
    sharedEmotes:  Emote[];
}

export interface Emote {
    id:        string;
    code:      string;
    imageType: string;
    userId?:   string;
    user?:     User;
}

export interface User {
    id:          string;
    name:        string;
    displayName: string;
    providerId:  string;
}

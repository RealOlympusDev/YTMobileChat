export interface SevenTVEmotes {
    id:                string;
    name:              string;
    owner:             Owner;
    visibility:        number;
    visibility_simple: string[];
    mime:              MIME;
    status:            number;
    tags:              null;
    width:             number[];
    height:            number[];
    urls:              Array<string[]>;
}

export enum MIME {
    ImageWebp = "image/webp",
}

export interface Owner {
    id:                  string;
    twitch_id:           string;
    login:               string;
    display_name:        string;
    role:                Role;
    profile_picture_id?: string;
}

export interface Role {
    id:       string;
    name:     Name;
    position: number;
    color:    number;
    allowed:  number;
    denied:   number;
}

export enum Name {
    Default = "Default",
    Moderator = "Moderator",
    Null = "NULL",
    Subscriber = "Subscriber",
    Verified = "Verified",
}

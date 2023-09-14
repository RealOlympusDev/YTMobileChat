export interface TruffleEmote {
    id:         string;
    name:       null | string;
    provider:   number;
    ext?:       string;
    bitIndex?:  number;
    channelId?: string;
}
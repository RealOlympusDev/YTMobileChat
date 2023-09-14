import {
	VideoData,
} from '../util/youtube';

import { v4 as uuid } from 'uuid';
import Proto from '../proto/index';
import { ok, Result } from 'neverthrow';

import { SevenTVEmotes } from './7TV';
import { BTTVEmotes } from './BTTV';
import { FFZEmote } from './FFZ';
import { TruffleEmote } from './Truffle';

const API_KEY = "{API_KEY}";

export interface YTChannels {
  kind:          string;
  etag:          string;
  nextPageToken: string;
  regionCode:    string;
  pageInfo:      PageInfo;
  items:         Item[];
}

export interface Item {
  kind:    ItemKind;
  etag:    string;
  id:      ID;
  snippet: Snippet;
}

export interface ID {
  kind:      IDKind;
  channelId: string;
}

export enum IDKind {
  YoutubeChannel = "youtube#channel",
}

export enum ItemKind {
  YoutubeSearchResult = "youtube#searchResult",
}

export interface Snippet {
  publishedAt:          Date;
  channelId:            string;
  title:                string;
  description:          string;
  thumbnails:           Thumbnails;
  channelTitle:         string;
  liveBroadcastContent: LiveBroadcastContent;
  publishTime:          Date;
}

export enum LiveBroadcastContent {
  None = "none",
  Upcoming = "upcoming",
}

export interface Thumbnails {
  default: Default;
  medium:  Default;
  high:    Default;
}

export interface Default {
  url: string;
}

export interface PageInfo {
  totalResults:   number;
  resultsPerPage: number;
}

export const getBTTVEmotes = async (channelId: string): Promise<Result<BTTVEmotes, Error>> => {
  try {
    const res = await fetch(
      `https://api.betterttv.net/3/cached/users/youtube/${channelId}`,
      {
        method: 'GET',
        headers: {Accept: "application/json"}
      }
    );
    if (!res.ok) {
      console.info(res.statusText)
    }
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(e);
  }
}

export const getTruffleEmotes = async (channelId: string): Promise<Result<[TruffleEmote], Error>> => {
  try {
    const res = await fetch(
      `https://v2.truffle.vip/gateway/emotes/c/${channelId}`,
      {
        method: 'GET',
        headers: {Accept: "application/json"}
      }
    );
    if (!res.ok) {
      console.info(res.statusText)
    }
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(e);
  }
}

export const getFFZEmotes = async (channelId: string): Promise<Result<[FFZEmote], Error>> => {
  try {
    const res = await fetch(
      `https://api.betterttv.net/3/cached/frankerfacez/users/youtube/${channelId}`,
      {
        method: 'GET',
        headers: {Accept: "application/json"}
      }
    );
    if (!res.ok) {
      console.info(res.statusText)
    }
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(e);
  }
}

export const get7TVEmotes = async (channelId: string): Promise<Result<[SevenTVEmotes], Error>> => {
  try {
    const res = await fetch(
      `https://api.7tv.app/v2/users/${channelId}/emotes`,
      {
        method: 'GET',
        headers: {Accept: "application/json"}
      }
    );
    if (!res.ok) {
      console.info(res.statusText)
    }
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(e);
  }
}


export const searchChannel = async (channel: string): Promise<Result<YTChannels, Error>> => {
    try {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=25&q=${channel}&key=${API_KEY}`,
        {
          method: 'GET',
          headers: {Accept: "application/json"}
        }
      );
      if (!res.ok) {
        console.info(res.statusText)
      }
      const data = await res.json();
      return ok(data);
    } catch (e) {
      console.error(e);
    }
}

export const sendMessage = async (videoData: VideoData, message: string) => {
    try {
      const res = await fetch(
        `https://www.youtube.com/youtubei/v1/live_chat/send_message?key=${videoData.config.INNERTUBE_API_KEY}&prettyPrint=false`,
        {
          method: 'POST',
          body: JSON.stringify({
            context: videoData.config.INNERTUBE_CONTEXT,
            clientMessageId: uuid(),
            richMessage: {textSegments: [{text: message}]},
            params: Proto.encodeMessageParams("fuslie", "rCZ4gxF7Ows"),
          }),
        }
      );
      if (!res.ok) {
        console.info(res.statusText)
      }
      const data = await res.json();
      console.info(data);
    } catch (e) {
      console.error(e);
    }
}

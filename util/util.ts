import { err } from 'neverthrow';
import { Buffer } from "buffer";

export const notFound = err<never, [string, number]>(['Not Found', 404]);

export const youtubeHeaders = {
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
};

export function traverseJSON<T>(
	obj: Json,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (value: any, key: string | number) => T | undefined
): T | undefined {
	if (!obj) return;
	if (typeof obj === 'object') {
		const entries = (<any>Object).entries(obj);
		for (const [key, value] of entries) {
			const itemResult = callback(value, key);
			if (itemResult) return itemResult;
			const subResult = traverseJSON(value, callback);
			if (subResult) return subResult;
		}
	}
}

export const CLIENTS = Object.freeze({
	WEB: {
	  NAME: 'WEB',
	  VERSION: '2.20220902.01.00'
	},
	YTMUSIC: {
	  NAME: 'WEB_REMIX',
	  VERSION: '1.20211213.00.00'
	},
	ANDROID: {
	  NAME: 'ANDROID',
	  VERSION: '17.17.32',
	  SDK_VERSION: '29'
	},
	YTMUSIC_ANDROID: {
	  NAME: 'ANDROID_MUSIC',
	  VERSION: '5.17.51'
	},
	TV_EMBEDDED: {
	  NAME: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER',
	  VERSION: '2.0'
	}
  });

export function u8ToBase64(u8: Uint8Array) {
	return Buffer.from(u8).toString('base64');
}

export type Json = JsonPrimitive | JsonArray | JsonObject;
type JsonPrimitive = null | boolean | number | string;
type JsonArray = Json[];
export type JsonObject = {
	[key: string]: Json;
};

export function isObject(obj: unknown): obj is JsonObject {
	return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.parseYTString = exports.parseChatAction = exports.getContinuationToken = exports.getVideoData = void 0;
var neverthrow_1 = require("neverthrow");
var types_1 = require("./types");
var util_1 = require("./util");
function getVideoData(urls) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _i, urls_1, url, text, initialData, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, urls_1 = urls;
                    _a.label = 1;
                case 1:
                    if (!(_i < urls_1.length)) return [3 /*break*/, 4];
                    url = urls_1[_i];
                    return [4 /*yield*/, fetch(url, {
                            headers: util_1.youtubeHeaders
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok)
                        return [3 /*break*/, 4];
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!response || response.status === 404)
                        return [2 /*return*/, (0, neverthrow_1.err)(['Stream not found', 404])];
                    if (!response.ok)
                        return [2 /*return*/, (0, neverthrow_1.err)([
                                'Failed to fetch stream: ' + response.statusText,
                                response.status,
                            ])];
                    return [4 /*yield*/, response.text()];
                case 5:
                    text = _a.sent();
                    initialData = getMatch(text, /(?:window\s*\[\s*["']ytInitialData["']\s*\]|ytInitialData)\s*=\s*({.+?})\s*;/);
                    if (initialData.isErr())
                        return [2 /*return*/, initialData];
                    config = getMatch(text, /(?:ytcfg.set)\(({[\s\S]+?})\)\s*;/);
                    if (config.isErr())
                        return [2 /*return*/, config];
                    if (!config.value.INNERTUBE_API_KEY || !config.value.INNERTUBE_CONTEXT)
                        return [2 /*return*/, (0, neverthrow_1.err)(['Failed to load YouTube context', 500])];
                    return [2 /*return*/, (0, neverthrow_1.ok)({ initialData: initialData.value, config: config.value })];
            }
        });
    });
}
exports.getVideoData = getVideoData;
function getMatch(html, pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    var match = pattern.exec(html);
    if (!(match === null || match === void 0 ? void 0 : match[1]))
        return (0, neverthrow_1.err)(['Failed to find video data', 404]);
    try {
        return (0, neverthrow_1.ok)(JSON.parse(match[1]));
    }
    catch (_a) {
        return (0, neverthrow_1.err)(['Failed to parse video data', 404]);
    }
}
function getContinuationToken(continuation) {
    var _a;
    var key = Object.keys(continuation)[0];
    return (_a = continuation[key]) === null || _a === void 0 ? void 0 : _a.continuation;
}
exports.getContinuationToken = getContinuationToken;
function parseChatAction(data) {
    var _a, _b, _c;
    var actionType = Object.keys(data)[0];
    var action = (_a = data[actionType]) === null || _a === void 0 ? void 0 : _a.item;
    if (!action)
        return;
    var rendererType = Object.keys(action)[0];
    switch (rendererType) {
        case 'liveChatTextMessageRenderer': {
            var renderer = action[rendererType];
            return {
                type: 'message',
                message: parseYTString(renderer.message),
                id: renderer.id,
                author: {
                    id: renderer.authorExternalChannelId,
                    name: parseYTString(renderer.authorName),
                    badges: (_c = (_b = renderer.authorBadges) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                        var _b, _c, _d, _e;
                        var badge = _a.liveChatAuthorBadgeRenderer;
                        return ({
                            tooltip: badge.tooltip,
                            type: badge.icon ? 'icon' : 'custom',
                            badge: badge.icon
                                ? badge.icon.iconType
                                : (_e = (_d = (_c = (_b = badge.customThumbnail) === null || _b === void 0 ? void 0 : _b.thumbnails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.url) !== null && _e !== void 0 ? _e : ''
                        });
                    })) !== null && _c !== void 0 ? _c : []
                },
                unix: Math.round(Number(renderer.timestampUsec) / 1000)
            };
        }
    }
}
exports.parseChatAction = parseChatAction;
function parseYTString(string) {
    if (string.simpleText)
        return string.simpleText;
    if (string.runs)
        return string.runs
            .map(function (run) {
            var _a, _b, _c, _d;
            if ((0, types_1.isTextRun)(run)) {
                return run.text;
            }
            else {
                if (run.emoji.isCustomEmoji) {
                    return " ".concat((_d = (_c = (_b = (_a = run.emoji.image.accessibility) === null || _a === void 0 ? void 0 : _a.accessibilityData) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : run.emoji.searchTerms[1]) !== null && _d !== void 0 ? _d : run.emoji.searchTerms[0], " ");
                }
                else {
                    return run.emoji.emojiId;
                }
            }
        })
            .join('')
            .trim();
    return '';
}
exports.parseYTString = parseYTString;

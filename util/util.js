"use strict";
exports.__esModule = true;
exports.isObject = exports.traverseJSON = exports.youtubeHeaders = exports.notFound = void 0;
var neverthrow_1 = require("neverthrow");
exports.notFound = (0, neverthrow_1.err)(['Not Found', 404]);
exports.youtubeHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
};
function traverseJSON(obj, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
callback) {
    if (!obj)
        return;
    if (typeof obj === 'object') {
        var entries = Object.entries(obj);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], value = _a[1];
            var itemResult = callback(value, key);
            if (itemResult)
                return itemResult;
            var subResult = traverseJSON(value, callback);
            if (subResult)
                return subResult;
        }
    }
}
exports.traverseJSON = traverseJSON;
function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}
exports.isObject = isObject;

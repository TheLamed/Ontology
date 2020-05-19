"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setCookie(key, value, time) {
    var val = value;
    var cookie = key + '=' + val;
    if (time != null)
        cookie += "; expires=" + time.toUTCString();
    cookie += "; path=/";
    document.cookie = cookie;
}
exports.setCookie = setCookie;
function getCookie(key) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + key + "=");
    if (parts == null)
        return null;
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}
exports.getCookie = getCookie;
//# sourceMappingURL=shared.functions.js.map
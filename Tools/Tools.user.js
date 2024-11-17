"use strict";
// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.10.0
// @match        *://*/*
// @author       paul
// @license      MIT
// @grant        GM_getValue
// @run-at       document-start
// @grant        unsafeWindow
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL  https://github.com/Paul-16098/vs_code/raw/main/js/userjs/Tools.user.js
// @updateURL    https://github.com/Paul-16098/vs_code/raw/main/js/userjs/Tools.user.js
// ==/UserScript==
const _unsafeWindow = unsafeWindow ?? window;
const IS_DEBUG_LOG = GM_getValue("debug.debug_log", false);
// 設置和初始化 GM API 的函數
function setGM() {
    let debug = console.debug;
    {
        // 初始化 GM API 相關的方法和信息
        var _GM_xmlhttpRequest, _GM_registerMenuCommand, _GM_notification, _GM_addStyle, _GM_openInTab, _GM_info, _GM_setClipboard;
        {
            // 處理 GM_xmlhttpRequest
            if (typeof GM_xmlhttpRequest !== "undefined") {
                _GM_xmlhttpRequest = GM_xmlhttpRequest;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.xmlHttpRequest !== "undefined") {
                _GM_xmlhttpRequest = GM.xmlHttpRequest;
            }
            else {
                _GM_xmlhttpRequest = (f) => {
                    fetch(f.url, {
                        method: f.method || "GET",
                        body: f.data,
                        headers: f.headers,
                    })
                        .then((response) => response.text())
                        .then((data) => {
                        f.onload && f.onload({ response: data });
                    })
                        .catch(f.onerror && f.onerror());
                };
            }
        }
        {
            // 處理 GM_registerMenuCommand
            if (typeof GM_registerMenuCommand !== "undefined") {
                _GM_registerMenuCommand = GM_registerMenuCommand;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.registerMenuCommand !== "undefined") {
                _GM_registerMenuCommand = GM.registerMenuCommand;
            }
            else {
                _GM_registerMenuCommand = (s, f) => {
                    debug(s);
                    debug(f);
                };
            }
        }
        {
            // 處理 GM_info
            if (typeof GM_info !== "undefined") {
                _GM_info = GM_info;
            }
            else if (typeof GM !== "undefined" && typeof GM.info !== "undefined") {
                _GM_info = GM.info;
            }
            else {
                _GM_info = { script: {} };
            }
        }
        {
            // 處理 GM_notification
            if (typeof GM_notification !== "undefined") {
                _GM_notification = GM_notification;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.notification !== "undefined") {
                _GM_notification = GM.notification;
            }
            else {
                _GM_notification = (s) => {
                    alert("_GM_notification: " + String(s.text || s));
                };
            }
        }
        {
            // 處理 GM_openInTab
            if (typeof GM_openInTab !== "undefined") {
                _GM_openInTab = GM_openInTab;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.openInTab !== "undefined") {
                _GM_openInTab = GM.openInTab;
            }
            else {
                _GM_openInTab = (s, t) => {
                    window.open(s);
                    debug(t);
                };
            }
        }
        {
            // 處理 GM_addStyle
            if (typeof GM_addStyle !== "undefined") {
                _GM_addStyle = GM_addStyle;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.addStyle !== "undefined") {
                _GM_addStyle = GM.addStyle;
            }
            else {
                _GM_addStyle = (CssStr) => {
                    let styleEle = document.createElement("style");
                    styleEle.classList.add("_GM_addStyle");
                    styleEle.innerHTML = CssStr;
                    document.head.appendChild(styleEle);
                    return styleEle;
                };
            }
        }
        {
            // 處理 GM_setClipboard
            if (typeof GM_setClipboard !== "undefined") {
                _GM_setClipboard = GM_setClipboard;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.setClipboard !== "undefined") {
                _GM_setClipboard = GM.setClipboard;
            }
            else {
                _GM_setClipboard = (s, i) => {
                    debug(s);
                    debug(i);
                };
            }
        }
    }
}
// 從 DOM 中移除指定的元素
function remove_ele(...args) {
    try {
        if (args && args.length > 0) {
            args.forEach((args) => {
                if (IS_DEBUG_LOG) {
                    console.log("args: ", args);
                    console.log("document.querySelectorAll(args): ", document.querySelectorAll(args));
                }
                if (document.querySelectorAll(args).length !== 0) {
                    document.querySelectorAll(args).forEach((ele) => {
                        ele.remove();
                    });
                }
                else {
                    console.debug(args, "is not a Html Element.");
                }
            });
        }
        else {
            throw new Error("fn remove error, args is not a array or args.length =< 0");
        }
    }
    catch (e) {
        console.error(e);
        return [false, args, e];
    }
    return [true, args];
}
// 設置菜單功能，允許註冊命令並處理顯示值的映射
function setMenu(name, fn, showValueMapping) {
    // 顯示值的映射
    let trueShowMapping = showValueMapping ?? {
        true: "true",
        false: "false",
    };
    let showName = name.replaceAll("_", " ");
    let getValue = GM_getValue(name);
    let showValue = trueShowMapping[getValue];
    let trueFn = fn ??
        ((ev) => {
            GM_setValue(name, !getValue);
            window.location.reload();
        });
    return GM_registerMenuCommand(`${showName}: ${showValue}`, trueFn);
}
// 定義一個新的評估函數，用於執行傳入的字符串代碼
function newEval(stringCode) {
    // 檢查是否包含不允許的關鍵字或代碼
    let bList = [
        "eval",
        "function",
        "let",
        "var",
        "window",
        "document",
    ];
    // 遍歷不允許的字元或代碼列表
    bList.forEach(function (value) {
        switch (typeof value) {
            case "string": {
                // 檢查字符串是否包含不允許的字元
                if (stringCode.includes(value)) {
                    throw Error("不允許的字元或代碼: " + JSON.stringify(value));
                }
                break;
            }
            case "object": {
                // 用於正則表達式的類型檢查
                if (value instanceof RegExp) {
                    // 檢查字符串是否匹配不允許的正則表達式
                    if (value.test(stringCode)) {
                        throw Error("不允許的字元或代碼: " + JSON.stringify(value));
                    }
                    break;
                }
            }
            default: {
                break;
            }
        }
    });
    // 返回執行傳入字符串代碼的結果
    return new Function(`return (${stringCode})`)();
}
//# sourceMappingURL=Tools.user.js.map
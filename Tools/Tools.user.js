"use strict";
// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.14.0-beta
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
// 避免重複宣告 _unsafeWindow
const _unsafeWindow = unsafeWindow ?? window;
const IS_DEBUG_LOG = GM_getValue("IS_DEBUG_LOG", false);
/**
 * 初始化 GM API 代理，兼容不同腳本管理器環境。
 * 會自動偵測可用的 GM_* API，並設置對應的變數。
 * 若無法取得則提供降級方案。
 */
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
/**
 * 從 DOM 中移除指定選擇器的所有元素。
 * @param args - CSS 選擇器字串陣列
 * @returns [true, args] 或 [false, args, error]
 */
function removeElement(...args) {
    try {
        if (args) {
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
    }
    catch (e) {
        console.error(e);
        return [false, args, e];
    }
    return [true, args];
}
/**
 * 註冊一個用戶菜單命令，支援布林值自動切換與自定義顯示。
 *
 * @param name - 設定名稱（同時作為 GM 存儲 key）
 * @param fn - (可選) 點擊時執行的函數，若為布林值預設為切換並重載
 * @param def - (可選) 預設值
 * @param showMapping - (可選) 顯示映射表
 * @returns 菜單命令ID
 *
 * @remarks
 * - 如果值為 `name` 是未定義的，且提供了 `def`，則將 `def` 設置為初始值。
 * - 對於布林值，菜單會顯示切換選項，並在變更時重新加載頁面。
 * - 對於不支持的類型，當選擇菜單項時會記錄錯誤。
 */
function setMenu(name, fn, def, showMapping) {
    // 顯示值的映射
    const trueShowMapping = {
        true: "開",
        false: "關",
        ...(showMapping ?? {}),
    };
    let support = false;
    let showName = trueShowMapping[name] ?? name.replaceAll("_", " ");
    let getValue = GM_getValue(name);
    let showValue = "No support";
    if (getValue === undefined && def !== undefined) {
        // 如果沒有值，則使用默認值
        GM_setValue(name, def);
        getValue = def;
        console.debug(`setMenu: ${name} set default value: ${def}`);
    }
    if (typeof getValue === "boolean") {
        support = true;
        showValue = getValue.toString();
    }
    showValue = trueShowMapping[getValue] ?? showValue;
    const trueFn = fn ??
        (support
            ? function (ev) {
                if (typeof getValue === "boolean") {
                    GM_setValue(name, !getValue);
                    window.location.reload();
                }
            }
            : () => {
                let t = "the type is not supported: " + typeof getValue;
                // alert(t);
                console.error(t);
            });
    return GM_registerMenuCommand(`${showName}: ${showValue}`, trueFn);
}
/**
 * 安全執行傳入的字串代碼，支援黑名單過濾。
 * @param stringCode - 要執行的代碼
 * @param safety - 是否啟用安全過濾
 * @returns 執行結果
 * @throws 若包含黑名單關鍵字則丟出錯誤
 */
function newEval(stringCode, safety = true) {
    // 檢查是否包含不允許的關鍵字或代碼
    const blackList = [
        "eval", // 防止執行惡意代碼
        "function", // 防止構造新的函數對象
        "let",
        "var", // 防止變量聲明
        "document", // 防止 DOM 操作
        "alert", // 防止彈窗
        "navigator", // 防止獲取瀏覽器相關信息
        "localStorage",
        "sessionStorage", // 防止訪問瀏覽器的存儲
        "console", // 防止使用 console.log 或其他控制枱方法
        "XMLHttpRequest",
        "fetch", // 防止發起網絡請求
        "import",
        "export", // 防止模塊導入和導出
        "async",
        "await", // 防止定義異步函數
        "with", // 防止使用 with 語句
        "Promise", // 防止使用 Promise，可能導致複雜的異步操作
        /window\.[0-9a-zA-Z_]+ *=/, // 檢查對 window 對象的屬性賦值
    ];
    if (safety) {
        // 遍歷不允許的字元或代碼列表
        for (const value of blackList) {
            if (typeof value === "string") {
                if (stringCode.includes(value)) {
                    throw new Error(`不允許的關鍵字或代碼: ${JSON.stringify(value)},在代碼: ${stringCode}`);
                }
            }
            else if (value instanceof RegExp) {
                if (value.test(stringCode)) {
                    throw new Error(`不允許的關鍵字或代碼: ${value},在代碼: ${stringCode}`);
                }
            }
        }
    }
    // 返回執行傳入字符串代碼的結果
    return new Function(`${safety ? "return" : ""} ${stringCode}`)();
}
// #region i18n
/**
 * 多語系(i18n)工具類，支援多語言字典與動態參數替換。
 */
class i18n {
    /** 語言字典資料 */
    langJson;
    /** 語言優先順序列表 */
    langList = [];
    /**
     * 建構子
     * @param langJson - 語言字典
     * @param lang - 語言代碼或語言代碼陣列
     */
    constructor(langJson, lang) {
        // 構造函數，接受語言和語言映射
        this.langJson = langJson;
        if (lang instanceof Array) {
            // 如果傳入的是數組
            this.langList.push(...lang);
        }
        else if (typeof lang === "string") {
            // 如果傳入的是單個語言
            this.langList.push(lang);
        }
    }
    /**
     * 取得本地化字串，支援參數替換。
     * @param key - 字典鍵值
     * @param args - 參數
     * @returns 對應語言的字串，若無則回傳key
     */
    get(key, ...args) {
        for (const lang of this.langList) {
            // 遍歷語言列表
            if (this.langJson[lang] && this.langJson[lang][key]) {
                // 檢查語言映射中是否存在該鍵
                let text = this.langJson[lang][key]; // 獲取對應的語言文本
                if (args && args.length > 0) {
                    // 如果傳入了參數
                    text = text.replace(/{(\d+)}/g, (match, number) => {
                        if (number >= 0 && number < args.length) {
                            // 替換文本中的 {n} 參數
                            return typeof args[number] === "undefined" ? match : args[number];
                        }
                        return match;
                    });
                }
                return text;
            }
        }
        console.warn(`Translation missing for key: "${key}"`); // 警告缺少的翻譯
        return String(key); // 如果沒有找到對應的翻譯，返回key本身
    }
    /**
     * 別名，等同 get
     */
    t = this.get;
}
// #endregion i18n
//# sourceMappingURL=Tools.user.js.map
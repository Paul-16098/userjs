"use strict";
/* eslint-disable no-unused-vars */
// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.14.0
// @match        *://*/*
// @author       paul
// @license      MIT
// @grant        GM_getValue
// @run-at       document-start
// @grant        unsafeWindow
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// @downloadURL  https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// @updateURL    https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// ==/UserScript==
// 避免重複宣告 _unsafeWindow
const _unsafeWindow = unsafeWindow ?? globalThis;
const IS_DEBUG_LOG = GM_getValue("IS_DEBUG_LOG", false);
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
                if (document.querySelectorAll(args).length === 0) {
                    console.debug(args, "is not a Html Element.");
                }
                else {
                    document.querySelectorAll(args).forEach((ele) => {
                        ele.remove();
                    });
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
        ...showMapping,
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
                    globalThis.location.reload();
                }
            }
            : () => {
                let t = "the type is not supported: " + typeof getValue;
                console.error(t);
            });
    return GM_registerMenuCommand(`${showName}: ${showValue}`, trueFn);
}
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
    /window\.[\da-zA-Z_]+ *=/, // 檢查對 window 對象的屬性賦值
];
/**
 * 安全執行傳入的字串代碼，支援黑名單過濾。
 * @param stringCode - 要執行的代碼
 * @param safety - 是否啟用安全過濾
 * @returns 執行結果
 * @throws 若包含黑名單關鍵字則丟出錯誤
 */
function newEval(stringCode, safety = true) {
    // 檢查是否包含不允許的關鍵字或代碼
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
class I18n {
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
        if (Array.isArray(lang)) {
            // 如果傳入的是數組
            this.langList.push(...lang);
        }
        else if (typeof lang === "string") {
            // 如果傳入的是單個語言
            this.langList.push(lang);
        }
        else {
            throw new TypeError("i18n:constructor:parameter:lang: not allow type");
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
            if (this.langJson[lang]?.[key]) {
                // 檢查語言映射中是否存在該鍵
                let text = this.langJson[lang][key]; // 獲取對應的語言文本
                if (args && args.length > 0) {
                    // 如果傳入了參數
                    text = text.replaceAll(/{(\d+)}/g, (match, number) => {
                        if (number >= 0 && number < args.length) {
                            // 替換文本中的 {n} 參數
                            return args[number] ?? match;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9vbHMudXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRvb2xzLnVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFtQztBQUNuQyxpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3RCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IseUJBQXlCO0FBQ3pCLHdCQUF3QjtBQUN4QixxQkFBcUI7QUFDckIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFDL0IsNkJBQTZCO0FBRTdCLDZEQUE2RDtBQUM3RCwrREFBK0Q7QUFDL0QsaUZBQWlGO0FBQ2pGLGlGQUFpRjtBQUNqRixrQkFBa0I7QUFFbEIsdUJBQXVCO0FBQ3ZCLE1BQU0sYUFBYSxHQUFHLFlBQVksSUFBSSxVQUFVLENBQUM7QUFFakQsTUFBTSxZQUFZLEdBQVksV0FBVyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUVqRTs7OztHQUlHO0FBQ0gsU0FBUyxhQUFhLENBQUMsR0FBRyxJQUFtQjtJQUMzQyxJQUFJLENBQUM7UUFDSCxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNwQixJQUFJLFlBQVksRUFBRSxDQUFDO29CQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxtQ0FBbUMsRUFDbkMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUNoQyxDQUFDO2dCQUNKLENBQUM7Z0JBQ0QsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUNqRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO3FCQUFNLENBQUM7b0JBQ04sUUFBUSxD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
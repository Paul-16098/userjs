// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.13.0-beta1
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

const IS_DEBUG_LOG: boolean = GM_getValue("IS_DEBUG_LOG", false);

// 設置和初始化 GM API 的函數
function setGM() {
  let debug = console.debug;
  {
    // 初始化 GM API 相關的方法和信息
    var _GM_xmlhttpRequest: Function,
      _GM_registerMenuCommand: Function,
      _GM_notification: Function,
      _GM_addStyle: Function,
      _GM_openInTab: Function,
      _GM_info: object,
      _GM_setClipboard: Function;
    {
      // 處理 GM_xmlhttpRequest
      if (typeof GM_xmlhttpRequest !== "undefined") {
        _GM_xmlhttpRequest = GM_xmlhttpRequest;
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.xmlHttpRequest !== "undefined"
      ) {
        _GM_xmlhttpRequest = GM.xmlHttpRequest;
      } else {
        _GM_xmlhttpRequest = (f: {
          url: string | URL | Request;
          method: any;
          data: any;
          headers: any;
          onload: (arg0: { response: string }) => any;
          onerror: () => any;
        }) => {
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
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.registerMenuCommand !== "undefined"
      ) {
        _GM_registerMenuCommand = GM.registerMenuCommand;
      } else {
        _GM_registerMenuCommand = (s: any, f: any) => {
          debug(s);
          debug(f);
        };
      }
    }
    {
      // 處理 GM_info
      if (typeof GM_info !== "undefined") {
        _GM_info = GM_info;
      } else if (typeof GM !== "undefined" && typeof GM.info !== "undefined") {
        _GM_info = GM.info;
      } else {
        _GM_info = { script: {} };
      }
    }
    {
      // 處理 GM_notification
      if (typeof GM_notification !== "undefined") {
        _GM_notification = GM_notification;
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.notification !== "undefined"
      ) {
        _GM_notification = GM.notification;
      } else {
        _GM_notification = (s: { text: any }) => {
          alert("_GM_notification: " + String(s.text || s));
        };
      }
    }
    {
      // 處理 GM_openInTab
      if (typeof GM_openInTab !== "undefined") {
        _GM_openInTab = GM_openInTab;
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.openInTab !== "undefined"
      ) {
        _GM_openInTab = GM.openInTab;
      } else {
        _GM_openInTab = (s: string | URL | undefined, t: any) => {
          window.open(s);
          debug(t);
        };
      }
    }
    {
      // 處理 GM_addStyle
      if (typeof GM_addStyle !== "undefined") {
        _GM_addStyle = GM_addStyle;
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.addStyle !== "undefined"
      ) {
        _GM_addStyle = GM.addStyle;
      } else {
        _GM_addStyle = (CssStr: string) => {
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
      } else if (
        typeof GM !== "undefined" &&
        typeof GM.setClipboard !== "undefined"
      ) {
        _GM_setClipboard = GM.setClipboard;
      } else {
        _GM_setClipboard = (s: any, i: any) => {
          debug(s);
          debug(i);
        };
      }
    }
  }
}

// 從 DOM 中移除指定的元素
function removeElement(...args: Array<string>) {
  try {
    if (args) {
      args.forEach((args) => {
        if (IS_DEBUG_LOG) {
          console.log("args: ", args);
          console.log(
            "document.querySelectorAll(args): ",
            document.querySelectorAll(args)
          );
        }
        if (document.querySelectorAll(args).length !== 0) {
          document.querySelectorAll(args).forEach((ele) => {
            ele.remove();
          });
        } else {
          console.debug(args, "is not a Html Element.");
        }
      });
    }
  } catch (e) {
    console.error(e);
    return [false, args, e];
  }
  return [true, args];
}

type setMenuFn = (ev?: MouseEvent | KeyboardEvent) => void;
// 設置菜單功能，允許註冊命令並處理顯示值的映射
function setMenu(
  name: string,
  fn?: setMenuFn | undefined,
  showMapping?:
    | {
        [x: string]: string;
      }
    | undefined
) {
  // 顯示值的映射
  const trueShowMapping: { [x: string]: string } = {
    true: "開",
    false: "關",
    ...(showMapping ?? {}),
  };
  let support = false;
  let showName: string = trueShowMapping[name] ?? name.replaceAll("_", " ");
  const getValue: any = GM_getValue(name);
  let showValue: string = "No support";
  if (typeof getValue === "boolean") {
    support = true;
    showValue = getValue.toString();
  }
  showValue = trueShowMapping[getValue] ?? showValue;

  const trueFn =
    fn ??
    (support
      ? function (ev: MouseEvent | KeyboardEvent) {
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

// 定義一個新的函數，用於執行傳入的字符串代碼
function newEval(stringCode: string, safety: boolean = true) {
  // 檢查是否包含不允許的關鍵字或代碼
  const blackList: Array<string | RegExp> = [
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
          throw new Error(
            `不允許的關鍵字或代碼: ${JSON.stringify(
              value
            )},在代碼: ${stringCode}`
          );
        }
      } else if (value instanceof RegExp) {
        if (value.test(stringCode)) {
          throw new Error(
            `不允許的關鍵字或代碼: ${value},在代碼: ${stringCode}`
          );
        }
      }
    }
  }
  // 返回執行傳入字符串代碼的結果
  return new Function(`${safety ? "return" : ""} ${stringCode}`)();
}

// #region i18n

class i18n {
  /**
   * 代表包含語言翻譯的JSON對象。
   *
   * 該對像以語言代碼作為頂級key進行構造，每個語言代碼映射到另一個對象，其中鍵是翻譯鍵，值是翻譯字符串。
   *
   * @example
   * ```typescript
   * const translations: langJson = {
   *   "en": {
   *     "greeting": "Hello",
   *     "farewell": "Goodbye"
   *   },
   *   "es": {
   *     "greeting": "Hola",
   *     "farewell": "Adiós"
   *   }
   * };
   * ```
   */
  public langJson: {
    [lang: string]: {
      [key: string]: string;
    };
  };

  /**
   * 語言代碼列表。
   *
   * @type {Array<string>}
   */
  langList: Array<string> = [];

  /**
   * 創建一個I18N實例。
   *
   * @param {langJson} langJson  -語言映射。
   * @param {(string | Array<string>)} lang  -語言代碼或語言代碼列表。
   */
  constructor(langJson: typeof this.langJson, lang: string | Array<string>) {
    // 構造函數，接受語言和語言映射
    this.langJson = langJson;
    if (lang instanceof Array) {
      // 如果傳入的是數組
      this.langList.push(...lang);
    } else if (typeof lang === "string") {
      // 如果傳入的是單個語言
      this.langList.push(lang);
    }
  }

  /**
   * 根據提供的key和可選參數檢索本地化字符串。
   *
   * @param key  -所需局部字符串的key。
   * @param args  -可選的參數以替換本地化字符串中的佔位符。
   * @returns 帶有佔位符的本地化字符串用提供的參數代替，或者一條表示未找到翻譯的消息。
   */
  public get(
    key: keyof (typeof this.langJson)[keyof typeof this.langJson],
    ...args: Array<any>
  ): string {
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
  public t = this.get; // 簡化方法名稱，方便使用
}
// #endregion i18n

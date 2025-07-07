/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.12.1
// @description  自動書籤,更改css,可以在看書頁找到作者連結
// @author       Paul-16098
// #tag 69shux.com
// @match        https://69shux.com/txt/*/*
// @match        https://69shux.com/txt/*/end.html
// @match        https://69shux.com/book/*.htm*
// @match        https://69shux.com/modules/article/bookcase.php*
// #tag www.69shu.top
// @match        https://www.69shu.top/txt/*/*
// @match        https://www.69shu.top/txt/*/end.html
// @match        https://www.69shu.top/book/*.htm*
// @match        https://www.69shu.top/modules/article/bookcase.php*
// #tag www.69shu.cx
// @match        https://www.69shu.cx/txt/*/*
// @match        https://www.69shu.cx/txt/*/end.html
// @match        https://www.69shu.cx/book/*.htm*
// @match        https://www.69shu.cx/modules/article/bookcase.php*
// #tag 69shuba.cx
// @match        https://69shuba.cx/txt/*/*
// @match        https://69shuba.cx/txt/*/end.html
// @match        https://69shuba.cx/book/*.htm*
// @match        https://69shuba.cx/modules/article/bookcase.php*
// #tag www.69shuba.pro
// @match        https://www.69shuba.pro/txt/*/*
// @match        https://www.69shuba.pro/txt/*/end.html
// @match        https://www.69shuba.pro/book/*.htm*
// @match        https://www.69shuba.pro/modules/article/bookcase.php*
// #tag 69shuba.me
// @match        https://69shu.me/txt/*/*
// @match        https://69shu.me/txt/*/end.html
// @match        https://69shu.me/book/*.htm*
// @match        https://69shu.me/modules/article/bookcase.php*
// #tag 69shu.biz
// @match        https://69shu.biz/c/*/*
// @match        https://69shu.biz/c/*/end.html
// @match        https://69shu.biz/b/*.htm*
// @match        https://69shu.biz/modules/article/bookcase.php*
// #tag www.69yuedu.net
// @match        https://www.69yuedu.net/r/*/*.html*
// @match        https://www.69yuedu.net/article/*.html*
// @match        https://www.69yuedu.net/modules/article/bookcase.php*
// #tag www.69shuba.com
// @match        https://www.69shuba.com/txt/*/*
// @match        https://www.69shuba.com/modules/article/bookcase.php*
// @match        https://www.69shuba.com/book/*.htm
// #tag twkan.com
// @match        https://twkan.com/txt/*/*
// @match        https://twkan.com/bookcase*
// @match        https://twkan.com/book/*.html

// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @run-at       document-idle
//#if debug
// #@require file://C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif

// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.css
// @resource     replace_json https://github.com/Paul-16098/userjs/raw/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/replace.json
// @license      MIT
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==

// 語言選項枚舉
enum Language {
  en = "en",
  zh = "zh",
}

/**
 * 用戶配置類，負責管理腳本的各項設置，並註冊菜單。
 */
class Config {
  /** 是否開啟偵錯模式 */
  Debug: boolean = GM_getValue("Debug", false);
  /** 結束頁是否自動關閉 */
  IsEndClose: boolean = GM_getValue("IsEndClose", true);
  /** 是否自動加入書櫃 */
  AutoAddBookcase: boolean = GM_getValue("AutoAddBookcase", true);
  /** 自動加入書櫃的封鎖名單（書ID陣列） */
  AutoAddBookcaseBlockade: Array<string> = GM_getValue(
    "AutoAddBookcaseBlockade",
    []
  );
  /** 是否攔截alert */
  IsHookAlert: boolean = GM_getValue("IsHookAlert", true);
  /** 攔截alert的訊息封鎖名單 */
  HookAlertBlockade: Array<Array<any>> = GM_getValue("HookAlertBlockade", [
    ["添加成功"],
    ["刪除成功!"],
    ["恭喜您，该章节已经加入到您的书签！"],
  ]);
  /** 語言設定 */
  Language: Language = GM_getValue("Language", Language.zh);

  constructor() {
    this.set();
    this.registerConfigMenu();
    return this;
  }
  /**
   * 註冊所有配置項的菜單
   */
  private registerConfigMenu() {
    for (const key in this) {
      const value = this[key as keyof Config];
      let menu = undefined;
      // 語言切換菜單
      if (Object.values(Language).includes(value as Language)) {
        menu = () => {
          Object.values(Language).forEach((lang) => {
            if (lang !== value) {
              GM_setValue("Language", lang);
              location.reload();
            }
          });
        };
      }
      setMenu(key, menu, value, {
        zh: "中文",
        en: "english",
        Debug: "偵錯",
        AutoAddBookcase: "自動添加書櫃",
        AutoAddBookcaseBlockade: "自動添加書櫃封鎖",
        Language: "語言",
        IsEndClose: "結束後關閉",
        IsHookAlert: "掛鉤Alert",
        HookAlertBlockade: "掛鉤Alert封鎖",
      });
    }
  }
  /**
   * 將當前配置寫入GM存儲
   */
  private set() {
    GM_setValue("Debug", this.Debug);
    GM_setValue("IsEndClose", this.IsEndClose);
    GM_setValue("AutoAddBookcase", this.AutoAddBookcase);
    GM_setValue("AutoAddBookcaseBlockade", this.AutoAddBookcaseBlockade);
    GM_setValue("IsHookAlert", this.IsHookAlert);
    GM_setValue("HookAlertBlockade", this.HookAlertBlockade);
    GM_setValue("Language", this.Language);
  }
}

// 配置初始化
const config: Config = new Config();

// i18n 設定
const i18nData: typeof i18n.prototype.langJson = {
  en: {
    noMatchingPattern: "No matching URL pattern found",
    errorOccurred: "An error occurred: ",
    noLabelsFound: "No labels found, retrying in 5 seconds...",
    maxRetriesReached: "Max retries reached. No labels found.",
    noUpdates: "No updates",
    updatesAvailable: " updates available",
  },
  zh: {
    noMatchingPattern: "未找到匹配的 URL 模式",
    errorOccurred: "發生了一些錯誤: ",
    noLabelsFound: "未找到標籤，5 秒後重試...",
    maxRetriesReached: "已達到最大重試次數。未找到標籤。",
    noUpdates: "沒有更新",
    updatesAvailable: "個更新",
  },
};

// 書籍數據接口
interface BookData {
  Updata: {
    url: {
      value: string;
      URLParams: URLSearchParams;
    };
  };
  Mate: {
    BookName: string;
    BookHtmlObj: Element;
    BookImgUrl: string;
  };
}

const i18nInstance = new i18n(i18nData, config.Language);
const t = i18nInstance.t;

/**
 * `BookManager` 類別提供了各種方法來管理網頁上與書籍相關的資料並與之互動。
 * 它包括偵測圖書頁面、圖書資訊頁面、結束頁面和書架頁面的功能。
 * 它還提供了處理導航、將書籍添加到書架以及修改頁面元素的方法。
 *
 * @class
 * @classdesc 此類旨在自動化並增強與圖書相關的網站的使用者體驗。
 *
 * @property {Object} data -包含用於偵測和處理書籍相關頁面的各種方法和模式。
 * @property {Function} data.HasBookInfo  -檢查是否可用書籍信息。
 * @property {Function} data.IsBookshelf  -檢查當前頁面是否是書架頁面。
 * @property {Object} data.Book  -包含與書籍操作有關的方法。
 * @property {Function} data.Book.GetAid  -檢索書ID。
 * @property {Function} data.Book.GetCid  -檢索章節ID。
 * @property {RegExp} data.Book.pattern  -標識書頁的模式。
 * @property {Function} data.Book.Is  -檢查當前頁面是否是書頁。
 * @property {Object} data.Info  -包含與書籍信息操作有關的方法。
 * @property {RegExp} data.Info.pattern  -識別圖書信息頁面的模式。
 * @property {Function} data.Info.Is  -檢查當前頁面是否是書籍信息頁面。
 * @property {Object} data.End  -包含與最終頁面操作相關的方法。
 * @property {Function} data.End.Is  -檢查當前頁面是否是結束頁面。
 * @property {Function} data.GetNextPageUrl  -檢索下一頁的URL。
 * @property {Function} data.IsNextEnd  -檢查下一頁是否是終點頁面。
 * @property {Function} data.IsBiz  -檢查當前域是否為“ 69shu.biz”。
 *
 * @constructor
 * @description 初始化 `Bookmanager` 類的新實例。它註冊了配置菜單並處理不同類型的頁面（書籍, 書籍信息, 結束, 書架）。如果設置了 `config.debug` 標誌, 它還記錄了調試信息。
 * @throws 如果發生錯誤並且未設置 `config.debug` , 將提醒用户。
 *
 * @method handleBookPage
 * @description 透過執行各種修改和增強來處理書籍頁面。
 * @private
 * @returns {void}
 *
 * @method hookAlert
 * @description 掛鈎全域「警報」功能以有條件地阻止或記錄警報訊息。
 * @private
 * @returns {void}
 *
 * @method addStyles
 * @description 透過從指定資源注入 CSS 內容, 將自訂樣式新增至文件。
 * @private
 * @returns {void}
 *
 * @method modifyPageNavigation
 * @description 透過刪除現有的「onkeydown」事件處理程序並新增新的「keydown」事件偵聽器來修改頁面導航。
 * @private
 * @returns {void}
 *
 * @method keydownHandler
 * @description 處理鍵盤事件, 以便在按下「向右箭頭」鍵時導覽至下一頁。
 * @private
 * @param {KeyboardEvent} e -鍵盤事件物件。
 * @returns {void}
 *
 * @method addBookcase
 * @description 將當前的書添加到書架中。
 * @private
 * @returns {void}
 *
 * @method insertAuthorLink
 * @description 插入作者鏈接並用新鏈接替換標題DIV。
 * @private
 * @returns {void}
 *
 * @method handleBookshelf
 * @description 通過收集書籍數據和註冊菜單命令來處理書架。
 * @private
 * @returns {Promise<void>}
 *
 * @method collectBookData
 * @description 通過以 `book_` 開頭查詢ID, 從DOM收集書籍數據。
 * @private
 * @param {number} [retryCount=0]  -當前的重試計數。
 * @returns {Promise<BookData[]>}  -解決一系列收集的書籍數據的承諾。
 *
 * @method registerMenuCommand
 * @description 註冊菜單命令, 其中包含收集的書籍數據。
 * @private
 * @param {BookData[]} bookData  -收集的書籍數據。
 * @returns {void}
 *
 * @method debugInfo
 * @description 收集和返回調試信息。
 * @private
 * @returns {Object}  -調試信息。
 *
 * @method registerConfigMenu
 * @description 註冊配置菜單。
 * @private
 * @returns {void}
 */
class BookManager {
  /** 常用選擇器集合 */
  SELECTORS = {
    nextPage: [
      "body > div.container > div.mybox > div.page1 > a:nth-child(4)",
      "body > div.mainbox > div > div.page1 > a:nth-child(4)",
    ],
    authorInfo:
      "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
    titleDiv: "body > div.container > div.mybox > div.tools",
    searchInput:
      "body > header > div > form > div > div.inputbox > input[type=text]",
    searchForm: "body > header > div > form",
  };
  /**
   * 各種頁面判斷與數據獲取方法集合
   */
  private data = {
    // 判斷是否有書籍信息
    HasBookInfo: () => typeof bookinfo !== "undefined",
    // 判斷是否在書架頁面
    IsBookshelf: (href: string = window.location.href) => {
      if (this.data.IsTwkan()) {
        return new URL(href).pathname === "/bookcase";
      } else {
        return new URL(href).pathname === "/modules/article/bookcase.php";
      }
    },
    // 書籍相關操作
    Book: {
      // 獲取書籍ID
      GetAid: (href: string = window.location.href) => {
        if (this.data.HasBookInfo()) {
          return bookinfo.articleid;
        }
        return href.split("/")[4];
      },
      // 獲取章節ID
      GetCid: (href: string = window.location.href) => {
        if (this.data.HasBookInfo()) {
          return bookinfo.chapterid;
        }
        return href.split("/")[5];
      },
      // 書籍URL模式
      pattern: /^\/(txt|c|r)\/([0-9]|[a-z])+\/([0-9]|[a-z])+(\.html)?$/m,
      // 判斷是否為書籍頁面
      Is: (href: string = window.location.href) => {
        return this.data.Book.pattern.test(new URL(href).pathname);
      },
    },
    // 書籍信息相關操作
    Info: {
      // 書籍信息URL模式
      pattern: /^\/(book|b|article)\/([0-9]|[a-z])+\.htm(l)?$/m,
      // 判斷是否為書籍信息頁面
      Is: (pathname: string = window.location.pathname) => {
        return this.data.Info.pattern.test(pathname);
      },
    },
    // 結束頁面相關操作
    End: {
      // 判斷是否為結束頁面
      Is: (href: string = window.location.href) => {
        if (this.data.Info.Is()) {
          const searchParams = new URL(href).searchParams;
          return searchParams.get("FromBook") === "true";
        }
        if (this.data.IsTwkan()) {
          let h = new URL(href);
          if (
            /txt\/[0-9]+\/end\.html/.test(h.pathname) &&
            h.searchParams.get("FromBook") === "true"
          ) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
    },
    // 獲取下一頁URL
    GetNextPageUrl: () => {
      const nextPageEle = this.getNextPageElement();
      return nextPageEle?.href;
    },
    // 判斷下一頁是否為結束頁面
    IsNextEnd: () => {
      if (this.data.Book.Is()) {
        const nextUrl = this.data.GetNextPageUrl();
        if (nextUrl) {
          return (
            this.data.End.Is(nextUrl) ||
            this.data.Info.Is(new URL(nextUrl).pathname)
          );
        }
      }
      return false;
    },
    // 判斷是否為69shu.biz域名
    IsBiz: (host: string = location.host) => {
      return host === "69shu.biz";
    },
    IsTwkan: (host: string = location.host) => {
      return host === "twkan.com";
    },
  };

  /**
   * 取得下一頁的a元素
   */
  getNextPageElement(): HTMLAnchorElement | null {
    for (const selector of this.SELECTORS.nextPage) {
      const element = document.querySelector(
        selector
      ) as HTMLAnchorElement | null;
      if (element && element.href) return element;
    }
    // 備用方案：尋找文字為"下一章"的連結
    return Array.from(document.querySelectorAll("a")).find(
      (link) => link.textContent === "下一章"
    ) as HTMLAnchorElement | null;
  }

  /**
   * 構造函數，根據當前頁面自動分派對應處理
   */
  constructor() {
    try {
      if (config.Debug) {
        console.debug(this.debugInfo());
      }

      // #tag search
      const search = new URLSearchParams(location.search).get("q");
      if (search) this.performSearch(search);

      // #tag BookEnd
      if (this.data.End.Is()) {
        if (config.Debug) console.log("End page detected");
        if (config.IsEndClose) window.close();
      }
      // #tag Book
      if (this.data.Book.Is()) {
        if (config.Debug) console.log("Book page detected");
        this.handleBookPage();
      }
      // #tag Info
      if (this.data.Info.Is()) {
        if (config.Debug) console.log("Book info page detected");
        let Ele = document.querySelector(
          "body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a"
        ) as HTMLAnchorElement | null;
        if (Ele) {
          Ele.click();
        }
      }
      // #tag Bookshelf
      if (this.data.IsBookshelf()) {
        if (config.Debug) console.log("Bookshelf page detected");
        this.handleBookshelf();
      }

      // if not match any pattern
      if (
        !this.data.Book.Is() &&
        !this.data.Info.Is() &&
        !this.data.End.Is() &&
        !this.data.IsBookshelf()
      ) {
        if (!config.Debug) {
          alert(t("noMatchingPattern"));
        }
      }
    } catch (error) {
      console.error(error);
      if (!config.Debug) {
        alert(`${t("errorOccurred")}${String(error)}`);
      }
    }
  }

  /**
   * 書頁自動化處理：樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接
   */
  private handleBookPage(): void {
    if (config.IsHookAlert) this.hookAlert();
    this.addStyles();
    this.modifyPageNavigation();
    removeElement(
      ".mytitle",
      ".top_Scroll",
      "#pagefootermenu",
      "body > div.container > div > div.yueduad1",
      "#pageheadermenu",
      ".bottom-ad2",
      "body > div.container > div.yuedutuijian.light"
    );
    if (config.AutoAddBookcase) this.autoAddToBookcase();
    this.insertAuthorLink();
    this.updateNextPageLink();
    if (this.data.IsTwkan()) {
      const replace_json = JSON.parse(GM_getResourceText("replace_json"));
      if (config.Debug) {
        console.log("replace_json: ", replace_json);
      }
      (document.querySelector("#txtcontent") as HTMLDivElement).innerText = (
        document.querySelector("#txtcontent") as HTMLDivElement
      )?.innerText
        .replaceAll("ⓣⓦⓚⓐⓝ.ⓒⓞⓜ", "twkan.com")
        .replaceAll("🅣🅦🅚🅐🅝.🅒🅞🅜", "twkan.com")
        .replaceAll("𝚝𝚠𝚔𝚊𝚗.𝚌𝚘𝚖", "twkan.com")
        .replaceAll("𝔱𝔴𝔨𝔞𝔫.𝔠𝔬𝔪", "twkan.com")
        .replaceAll("𝘁𝘄𝗸𝗮𝗻.𝗰𝗼𝗺", "twkan.com")
        .replaceAll("𝓉𝓌𝓀𝒶𝓃.𝒸ℴ𝓂", "twkan.com")
        .replaceAll("🆃🆆🅺🅰🅽.🅲🅾🅼", "twkan.com")
        .replaceAll("𝕥𝕨𝕜𝕒𝕟.𝕔𝕠𝕞", "twkan.com")
        .replaceAll("𝖙𝖜𝖐𝖆𝖓.𝖈𝖔𝖒", "twkan.com");

      for (const key in replace_json) {
        if (Object.prototype.hasOwnProperty.call(replace_json, key)) {
          const element = replace_json[key];
          (document.querySelector("#txtcontent") as HTMLDivElement).innerText =
            (
              document.querySelector("#txtcontent") as HTMLDivElement
            )?.innerText.replaceAll(key, element);
        }
      }
    }
  }

  /**
   * 自動加入書櫃（如未在封鎖名單）
   */
  private autoAddToBookcase(): void {
    const aid = this.data.Book.GetAid();
    if (!config.AutoAddBookcaseBlockade.includes(aid)) {
      this.addBookcase();
    } else {
      console.log("Book is in the blockade list, not auto adding to bookcase.");
    }
  }

  /**
   * 更新下一頁鏈接，附加FromBook參數
   */
  private updateNextPageLink(): void {
    const nextPageEle = this.getNextPageElement();
    if (nextPageEle) {
      const href = new URL(nextPageEle.href);
      href.searchParams.set("FromBook", "true");
      nextPageEle.href = href.toString();
    }
  }

  /**
   * 攔截全局alert，根據封鎖名單過濾
   */
  private hookAlert(): void {
    const _alert: Function = alert;
    unsafeWindow.alert = (...message: any) => {
      if (
        !config.HookAlertBlockade.some(
          (blockade) =>
            JSON.stringify(message) === JSON.stringify(blockade) ||
            JSON.stringify(blockade) === "*"
        )
      ) {
        _alert(...message);
      }
      if (config.Debug) console.log("Alert message:", message);
    };
  }

  /**
   * 注入自定義CSS樣式
   */
  private addStyles(): void {
    const css1 = GM_getResourceText("css1");
    GM_addStyle(css1);
    if (config.Debug) console.log("CSS added");
  }

  /**
   * 移除原有onkeydown，註冊自定義鍵盤導航
   */
  private modifyPageNavigation(): void {
    document.onkeydown = null;
    addEventListener("keydown", this.keydownHandler.bind(this));
  }

  /**
   * 處理右鍵導航與結束自動關閉
   */
  private keydownHandler(e: KeyboardEvent): void {
    if (!e.repeat && e.key === "ArrowRight") {
      const nextPageLink = this.data.GetNextPageUrl();
      if (nextPageLink) {
        let href = new URL(nextPageLink);
        href.searchParams.set("FromBook", "true");
        window.location.href = href.toString();
      }
      if (this.data.IsNextEnd()) {
        if (config.IsEndClose) {
          window.close();
        }
      }
    }
  }

  /**
   * 加入書櫃（根據不同站點呼叫不同API或模擬點擊）
   */
  private addBookcase(): void {
    const aid = this.data.Book.GetAid();
    const cid = this.data.Book.GetCid();
    if (!addbookcase.toString().includes("Ajax.Tip")) {
      addbookcase(aid, cid);
    } else {
      const addBookcaseLink = document.querySelector(
        "#a_addbookcase"
      ) as HTMLElement | null;
      addBookcaseLink?.click();
    }
  }

  /**
   * 替換標題div為帶有作者連結的新元素
   */
  private insertAuthorLink(): void {
    const author =
      document
        .querySelector(this.SELECTORS.authorInfo)
        ?.textContent?.trim()
        .split(" ")[1] ?? "undefined";
    const authorLink = this.createAuthorLink(author);
    const titleDiv = document.querySelector(
      this.SELECTORS.titleDiv
    ) as HTMLDivElement;
    if (titleDiv) {
      const titleLink = this.createTitleLink();
      titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
    }
  }

  /**
   * 建立作者頁面連結元素
   */
  private createAuthorLink(author: string): HTMLAnchorElement {
    const authorLink = document.createElement("a");
    authorLink.href = `${
      window.location.origin
    }/modules/article/author.php?author=${encodeURIComponent(author)}`;
    authorLink.textContent = author;
    authorLink.style.color = "#007ead";
    return authorLink;
  }

  /**
   * 建立書名連結元素
   */
  private createTitleLink(): HTMLAnchorElement {
    const titleLink = document.createElement("a");
    titleLink.innerHTML = this.data.HasBookInfo()
      ? bookinfo.articlename ?? document.title.split("-")[0]
      : document.title.split("-")[0];
    titleLink.classList.add("userjs_add");
    titleLink.id = "title";
    titleLink.href = `${window.location.origin}/${
      this.data.IsBiz() ? "b" : "book"
    }/${this.data.Book.GetAid()}.${
      this.data.IsBiz() || this.data.IsTwkan() ? "html" : "htm"
    }`;
    return titleLink;
  }

  /**
   * 書架頁面：收集書籍資料並註冊菜單
   */
  private async handleBookshelf(): Promise<void> {
    const bookData = await this.collectBookData();
    if (config.Debug) console.log("Bookshelf data collected", bookData);
    this.registerMenuCommand(bookData);
  }

  /**
   * 搜尋功能：自動填入並提交表單
   */
  private performSearch(search: string): void {
    const searchInput = document.querySelector(
      this.SELECTORS.searchInput
    ) as HTMLInputElement;
    const searchForm = document.querySelector(
      this.SELECTORS.searchForm
    ) as HTMLFormElement;
    if (searchInput && searchForm) {
      searchInput.value = search;
      searchForm.submit();
    }
  }

  /**
   * 遞迴收集書架書籍資料，最多重試5次
   */
  private async collectBookData(retryCount: number = 0): Promise<BookData[]> {
    const books: Array<BookData> = [];
    const labels = document.querySelectorAll("[id^='book_']");
    if (config.Debug) console.groupCollapsed("collectBookData");
    if (labels.length === 0) {
      if (retryCount <= 5) {
        console.warn(t("noLabelsFound"));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.collectBookData(retryCount + 1);
      } else {
        console.error(t("maxRetriesReached"));
        return []; // 到達最大重試次數, 返回空陣列
      }
    }
    if (config.Debug) {
      console.log(labels);
    }
    labels.forEach((label) => {
      const bookContainer = label;

      const tmp = (function () {
        if (
          Array.from(label.querySelectorAll("label")).find(
            (label2) => label2.textContent === "更新"
          )
        ) {
          // if (location.origin === "https://www.69yuedu.net") {
          // } else {
          const bookContinueEle = label.querySelector(
            "div.newright > a.btn.btn-tp"
          ) as HTMLAnchorElement;
          const bookContinueLink = bookContinueEle.href;

          const BookName = (
            label.querySelector("div.newnav > h3 > a > span") as HTMLSpanElement
          ).textContent as string;

          const bookImgEle = label.querySelector("a > img") as HTMLImageElement;
          const bookImgUrl = bookImgEle.src;
          // }
          return { bookContinueLink, BookName, bookImgUrl };
        } else {
          return false;
        }
      })();
      if (tmp) {
        const { bookContinueLink, BookName, bookImgUrl } = tmp;

        const push_data: BookData = {
          Updata: {
            url: {
              value: bookContinueLink,
              URLParams: new URLSearchParams(bookContinueLink),
            },
          },
          Mate: {
            BookName: BookName,
            BookHtmlObj: bookContainer,
            BookImgUrl: bookImgUrl,
          },
        };
        if (config.Debug) {
          console.group(push_data.Mate.BookName);
          console.log(push_data.Mate);
          console.table(push_data.Updata);
          console.groupEnd();
        }

        books.push(push_data);
      }
    });
    if (config.Debug) console.groupEnd();
    return books;
  }

  /**
   * 註冊菜單命令，點擊可批量打開所有更新書籍
   */
  private registerMenuCommand(bookData: BookData[]) {
    GM_registerMenuCommand(
      `${
        bookData.length === 0
          ? t("noUpdates")
          : `${bookData.length}${t("updatesAvailable")}`
      }`,
      () => {
        bookData.forEach((data) => {
          GM_openInTab(data.Updata.url.value);
        });
      }
    );
  }

  /**
   * 輸出調試資訊
   */
  private debugInfo() {
    return {
      IsBook: this.data.Book.Is(),
      IsInfo: this.data.Info.Is(),
      IsEnd: this.data.End.Is(),
      IsNextEnd: this.data.IsNextEnd(),
      IsBookshelf: this.data.IsBookshelf(),
      HasBookinfo: this.data.HasBookInfo(),
      IsBiz: this.data.IsBiz(),
      IsTwkan: this.data.IsTwkan(),
      ...config,
    };
  }
}

// 初始化書籍管理器
const bookManager = new BookManager();

/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      4.1.0
// @description  自動書籤,更改css,可以在看書頁找到作者連結
// @author       Paul-16098
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
// #@require file://c:\Users\pl816\OneDrive\文件\git\userjs\Tools\Tools.user.js
// #@resource BookPageCss file://c:\Users\pl816\OneDrive\文件\git\userjs\69shuba auto 書簽\BookPage.user.css
// #@resource StrReplace file://c:\Users\pl816\OneDrive\文件\git\userjs\69shuba auto 書簽\StrReplace.json
// #@resource RegReplace file://c:\Users\pl816\OneDrive\文件\git\userjs\69shuba auto 書簽\RegReplace.json
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// @resource BookPageCss https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/BookPage.user.css
// @resource StrReplace https://github.com/Paul-16098/userjs/raw/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/StrReplace.json
// @resource RegReplace https://github.com/Paul-16098/userjs/raw/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/RegReplace.json
//#endif

// @license      MIT
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==

/** 語言選項枚舉 */
enum Language {
  en = "en",
  zh = "zh",
}

/** 用戶配置類，負責管理腳本的各項設置，並註冊菜單 */
class Config {
  /** 是否開啟偵錯模式 */
  Debug: boolean = GM_getValue("Debug", false);
  /** 結束頁是否自動關閉 */
  IsEndClose: boolean = GM_getValue("IsEndClose", true);
  /** 是否自動加入書櫃 */
  AutoAddBookcase: boolean = GM_getValue("AutoAddBookcase", true);
  /** 自動加入書櫃的封鎖名單(書ID陣列) */
  AutoAddBookcaseBlockade: Array<string> = GM_getValue(
    "AutoAddBookcaseBlockade",
    [],
  );
  /** 是否攔截alert */
  IsHookAlert: boolean = GM_getValue("IsHookAlert", true);
  /** 攔截alert的訊息封鎖名單 */
  HookAlertBlockade: Array<Array<any>> = GM_getValue("HookAlertBlockade", [
    // opencclint-disable
    ["添加成功"],
    ["刪除成功!"],
    ["恭喜您，该章节已经加入到您的书签！"],
    // opencclint-enable
  ]);
  /** 語言設定 */
  Language: Language = GM_getValue("Language", Language.zh);

  constructor() {
    this.set();
    this.registerConfigMenu();
  }
  /** 註冊所有配置項的菜單 */
  private registerConfigMenu() {
    for (const key in this) {
      const value = this[key as keyof Config];
      let menu = undefined;
      // 語言切換菜單
      if (Object.values(Language).includes(value as Language)) {
        menu = () => {
          for (const lang of Object.values(Language)) {
            if (lang !== value) {
              GM_setValue("Language", lang);
              location.reload();
            }
          }
        };
      }
      setMenu(key, menu, value, {
        zh: "中文",
        en: "English",
        ...(this.Language == Language.zh
          ? {
              Debug: "偵錯",
              AutoAddBookcase: "自動添加書櫃",
              AutoAddBookcaseBlockade: "自動添加書櫃封鎖",
              Language: "語言",
              IsEndClose: "結束後關閉",
              IsHookAlert: "掛鉤Alert",
              HookAlertBlockade: "掛鉤Alert封鎖",
            }
          : {
              Debug: "Debug",
              AutoAddBookcase: "Auto Add Bookcase",
              AutoAddBookcaseBlockade: "Auto Add Bookcase Blockade",
              Language: "Language",
              IsEndClose: "Is End Close",
              IsHookAlert: "Is Hook Alert",
              HookAlertBlockade: "Hook Alert Blockade",

              true: "On",
              false: "Off",
            }),
      });
    }
  }
  /** 將當前配置寫入GM存儲 */
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

/** 書籍數據接口 */
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

interface Site {
  /** 常用選擇器集合 */
  readonly SELECTORS: {
    /** 下一頁按鈕選擇器 */
    nextPage: string;
    /** 作者信息選擇器 */
    authorInfo: string;
    /** 標題區域選擇器 */
    titleDiv: string;
    /** 搜索輸入框選擇器 */
    searchInput: string;
    /** 搜索表單選擇器 */
    searchForm: string;
  };
  /** 是否有書籍信息 */
  readonly HasBookInfo: boolean;
  /** 是否在書架頁面 */
  readonly IsBookshelf: () => boolean;
  readonly Book: {
    /** 獲取書籍ID */
    GetAid: () => string;
    /** 獲取章節ID */
    GetCid: () => string;

    pattern: RegExp;
    Is: () => boolean;
  };
  readonly Info: {
    pattern: RegExp;
    Is: () => boolean;
  };
  readonly End: {
    pattern?: RegExp;
    // eslint-disable-next-line no-unused-vars
    Is: (pathname?: string) => boolean;
  };

  readonly isSite: boolean;
}

class Site_tw implements Site {
  SELECTORS = {
    nextPage: "#container > div.page1 > a:nth-child(4)",
    authorInfo:
      "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
    titleDiv: "body > div.container > div.mybox > div.tools",
    searchInput:
      "body > header > div > form > div > div.inputbox > input[type=text]",
    searchForm: "body > header > div > form",
  };
  HasBookInfo = true;
  IsBookshelf = () => {
    return location.pathname === "/bookcase";
  };
  Book = {
    GetAid: () => {
      return bookinfo.articleid;
    },
    /** 獲取章節ID */
    GetCid: () => {
      return bookinfo.chapterid;
    },

    /** 書籍URL模式 */
    pattern: /^\/txt\/\d+\/\d+$/m,
    /** 判斷是否為書籍頁面 */
    Is: () => {
      return this.Book.pattern.test(location.pathname);
    },
  };
  Info = {
    pattern: /^\/book\/\d+\/index\.html$/m,
    /** 判斷是否為書籍信息頁面 */
    Is: (pathname = location.pathname) => {
      return this.Info.pattern.test(pathname);
    },
  };
  End = {
    pattern: /\/txt\/\d+\/end\.html/m,
    Is: (pathname = location.pathname) => {
      return this.End.pattern.test(pathname);
    },
  };
  isSite = location.host === "twkan.com";
}

class Site_69shuba implements Site {
  SELECTORS = {
    nextPage: "body > div.container > div.mybox > div.page1 > a:nth-child(4)",
    authorInfo:
      "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
    titleDiv: "body > div.container > div.mybox > div.tools",
    searchInput:
      "body > header > div > form > div > div.inputbox > input[type=text]",
    searchForm: "body > header > div > form",
  };
  HasBookInfo = true;
  IsBookshelf = () => {
    return location.pathname === "/modules/article/bookcase.php";
  };
  Book = {
    GetAid: () => {
      return bookinfo.articleid;
    },
    /** 獲取章節ID */
    GetCid: () => {
      return bookinfo.chapterid;
    },

    pattern: /\/txt\/\d+\/\d+/m,
    Is: () => {
      return this.Book.pattern.test(location.pathname);
    },
  };
  Info = {
    pattern: /\/book\/\d+\.htm/m,
    Is: () => {
      return this.Info.pattern.test(location.pathname);
    },
  };
  End = {
    Is: () => {
      if (this.Info.Is()) {
        const searchParams = new URL(location.href).searchParams;
        return searchParams.get("FromBook") === "true";
      }
      return false;
    },
  };
  isSite = location.host === "www.69shuba.com";
}

class BookManager {
  readonly Site: Site;

  /** i18n 處理實例，用於管理當前語言與字典資料 */
  readonly i18nInstance: I18n;
  /** 綁定的翻譯方法，避免 this 指向錯誤 */
  readonly t: typeof I18n.prototype.t;

  /** 取得下一頁的元素 */
  getNextPageElement(): HTMLAnchorElement | null {
    const element = document.querySelector<HTMLAnchorElement>(
      this.Site.SELECTORS.nextPage,
    );
    if (element?.href) return element;

    // 備用方案: 尋找文字為"下一章"的連結
    return Array.from(document.querySelectorAll("a")).find(
      (link) => link.textContent === "下一章",
    ) as HTMLAnchorElement | null;
  }

  /** 構造函數，根據當前頁面自動分派對應處理 */
  constructor(Site: Site) {
    this.Site = Site;
    this.i18nInstance = new I18n(i18nData, config.Language.toString());
    // 綁定 i18n 實例以確保 t 內部的 this 指向正確，避免在 BookManager 上下文中調用時出現 this.langList 錯誤
    this.t = this.i18nInstance.t.bind(this.i18nInstance);

    try {
      if (config.Debug) {
        console.debug(this.Site);
        console.debug(this.debugInfo());
      }

      // #tag search
      const search = new URLSearchParams(location.search).get("q");
      if (search) this.performSearch(search);

      // #tag BookEnd
      if (this.Site.End.Is()) {
        if (config.Debug) console.log("End page detected");
        if (config.IsEndClose) window.close();
      }
      // #tag Info
      if (this.Site.Info.Is()) {
        if (config.Debug) console.log("Book info page detected");
        document
          .querySelector<HTMLAnchorElement>(
            "body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a",
          )
          ?.click();
      }
      // #tag Book
      if (this.Site.Book.Is()) {
        if (config.Debug) console.log("Book page detected");
        this.handleBookPage();
      }
      // #tag Bookshelf
      if (this.Site.IsBookshelf()) {
        if (config.Debug) console.log("Bookshelf page detected");
        this.handleBookshelf();
      }

      // if not match any pattern
      if (
        !this.Site.Book.Is() &&
        !this.Site.Info.Is() &&
        !this.Site.IsBookshelf() &&
        !this.Site.End.Is()
      ) {
        if (!config.Debug) {
          alert(this.t("noMatchingPattern"));
        }
      }
    } catch (error) {
      if (!config.Debug) {
        alert(`${this.t("errorOccurred")}${String(error)}`);
      }
      throw error;
    }
  }

  /** 書頁自動化處理: 樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接 */
  private handleBookPage(): void {
    if (config.IsHookAlert) this.hookAlert();
    this.addStyles("BookPageCss");
    this.modifyPageNavigation();
    removeElement(
      ".mytitle",
      ".top_Scroll",
      "#pagefootermenu",
      "body > div.container > div > div.yueduad1",
      "#pageheadermenu",
      ".bottom-ad2",
      "body > div.container > div.yuedutuijian.light",
      "#container > br",
    );
    if (config.AutoAddBookcase) this.addToBookcase();
    this.insertAuthorLink();
    this.updateNextPageLink();
    this.replaceText();
  }

  /** 替換文本內容，根據替換字典進行替換 */
  private replaceText(): void {
    if (this.Site instanceof Site_tw) {
      const ele = document.querySelector<HTMLDivElement>("#txtcontent0")!;

      const RawStrReplace = GM_getResourceText("StrReplace");
      if (config.Debug) console.log("raw_replace_json: ", RawStrReplace);
      const StrReplace: string[] = JSON.parse(RawStrReplace);

      if (config.Debug) console.log("replace_json: ", StrReplace);

      for (const value of StrReplace) {
        ele.innerText = ele.innerText.replaceAll(value, "");
      }

      const RawRegReplace = GM_getResourceText("RegReplace");
      if (config.Debug) console.log("raw_reg_replace_json: ", RawRegReplace);
      const StrRegReplace: string[] = JSON.parse(RawRegReplace);
      const RegReplace: RegExp[] = [];
      StrRegReplace.forEach((pattern) => {
        RegReplace.push(new RegExp(pattern, "g"));
      });
      if (config.Debug) console.log("reg_replace_json: ", RegReplace);

      //   debugger;
      for (const pattern of RegReplace) {
        ele.innerText = ele.innerText.replaceAll(pattern, "");
      }
    }
  }

  /** 自動加入書櫃(如未在封鎖名單) */
  private addToBookcase(): void {
    const aid = this.Site.Book.GetAid();
    if (config.AutoAddBookcaseBlockade.includes(aid)) {
      console.log("Book is in the blockade list, not auto adding to bookcase.");
    } else {
      this.addBookcase();
    }
  }

  /** 更新下一頁鏈接，附加FromBook參數 */
  private updateNextPageLink(): void {
    const nextPageEle = this.getNextPageElement();
    if (nextPageEle) {
      const href = new URL(nextPageEle.href);
      href.searchParams.set("FromBook", "true");
      nextPageEle.href = href.toString();
    }
  }

  /** 攔截全局alert，根據封鎖名單過濾 */
  private hookAlert(): void {
    const _alert: Function = alert;
    unsafeWindow.alert = (...message: any) => {
      if (
        !config.HookAlertBlockade.some(
          (blockade) =>
            JSON.stringify(message) === JSON.stringify(blockade) ||
            JSON.stringify(blockade) === "*",
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
  private addStyles(name: string): void {
    const css = GM_getResourceText(name);
    const style = GM_addStyle(css);
    if (config.Debug) console.log(`CSS ${name} added`, style);
  }

  /** 移除原有onkeydown，註冊自定義鍵盤導航 */
  private modifyPageNavigation(): void {
    document.onkeydown = null;
    addEventListener("keydown", this.keydownHandler.bind(this));
  }

  /** 處理右鍵導航與結束自動關閉 */
  private keydownHandler(e: KeyboardEvent): void {
    if (!e.repeat && e.key === "ArrowRight") {
      const nextPageLink = document.querySelector<HTMLAnchorElement>(
        this.Site.SELECTORS.nextPage,
      )!.href;
      if (nextPageLink) {
        let href = new URL(nextPageLink);
        href.searchParams.set("FromBook", "true");
        globalThis.location.href = href.toString();
      }
      if (this.Site.End.Is(nextPageLink)) {
        if (config.IsEndClose) {
          window.close();
        }
      }
    }
  }

  /** 加入書櫃(根據不同站點呼叫不同API或模擬點擊) */
  private addBookcase(): void {
    if (addbookcase.toString().includes("Ajax.Tip")) {
      const addBookcaseLink =
        document.querySelector<HTMLElement>("#a_addbookcase");
      addBookcaseLink?.click();
    } else {
      const aid = this.Site.Book.GetAid();
      const cid = this.Site.Book.GetCid();
      addbookcase(aid, cid);
    }
  }

  /** 替換標題div為帶有作者連結的新元素 */
  private insertAuthorLink(): void {
    if (config.Debug) console.log("Inserting author link");
    // debugger;
    let author = this.Site.HasBookInfo
      ? bookinfo.author
      : (document
          .querySelector(this.Site.SELECTORS.authorInfo)
          ?.textContent?.trim()
          .split(" ")[1] ?? "undefined");

    const titleDiv = document.querySelector<HTMLDivElement>(
      this.Site.SELECTORS.titleDiv,
    );
    if (titleDiv) {
      const titleLink = this.createTitleLink();
      titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
    }
    const authorLink = this.createAuthorLink(author);

    let oal = document.querySelector(this.Site.SELECTORS.authorInfo)!;
    oal.parentNode!.replaceChild(authorLink, oal);
    if (config.Debug) console.log("Author link inserted");
  }

  /** 建立作者頁面連結元素 */
  private createAuthorLink(author: string): HTMLAnchorElement {
    const authorLink = document.createElement("a");
    if (this.Site instanceof Site_tw) {
      authorLink.href = `https://twkan.com/author/${author}.html`;
    } else {
      authorLink.href = `${globalThis.location.origin}/modules/article/author.php?author=${author}`;
    }
    authorLink.textContent = "作者:  " + author;
    authorLink.style.color = "#007ead";
    return authorLink;
  }

  /** 建立書名連結元素 */
  private createTitleLink(): HTMLAnchorElement {
    if (config.Debug) console.log("Creating title link");
    const titleLink = document.createElement("a");
    titleLink.innerHTML = this.Site.HasBookInfo
      ? (bookinfo.articlename ?? document.title.split("-")[0])
      : document.title.split("-")[0];
    titleLink.classList.add("userjs_add");
    titleLink.id = "title";
    titleLink.href = `${globalThis.location.origin}/book/${this.Site.Book.GetAid()}${this.Site instanceof Site_tw ? "/index.html" : ".htm"}`;
    if (config.Debug) console.log("Title link created:", titleLink);
    return titleLink;
  }

  /** 書架頁面: 收集書籍資料並註冊菜單 */
  private async handleBookshelf(): Promise<void> {
    const bookData = await this.collectBookData();
    if (config.Debug) console.log("Bookshelf data collected", bookData);
    this.registerOpenUpdateBookMenuCommand(bookData);
  }

  /** 搜尋功能: 自動填入並提交表單 */
  private performSearch(search: string): void {
    const searchInput = document.querySelector<HTMLInputElement>(
      this.Site.SELECTORS.searchInput,
    );
    const searchForm = document.querySelector<HTMLFormElement>(
      this.Site.SELECTORS.searchForm,
    );
    if (searchInput && searchForm) {
      searchInput.value = search;
      searchForm.submit();
    } else {
      throw new Error("Search input or form not found");
    }
  }

  /** 遞迴收集書架書籍資料，最多重試5次 */
  private async collectBookData(retryCount: number = 0): Promise<BookData[]> {
    const books: Array<BookData> = [];
    const labels = document.querySelectorAll("[id^='book_']");
    if (config.Debug) console.groupCollapsed("collectBookData");
    if (labels.length === 0) {
      if (retryCount <= 5) {
        console.warn(this.t("noLabelsFound"));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.collectBookData(retryCount + 1);
      } else {
        console.error(this.t("maxRetriesReached"));
        return []; // 到達最大重試次數, 返回空陣列
      }
    }
    if (config.Debug) {
      console.log(labels);
    }
    labels.forEach((label) => {
      const bookContainer = label;

      if (
        Array.from(label.querySelectorAll("label")).some(
          (label) => label.textContent === "更新",
        )
      ) {
        const bookContinueEle = label.querySelector<HTMLAnchorElement>(
          "div.newright > a.btn.btn-tp",
        )!;
        const bookContinueLink = bookContinueEle.href;

        const BookName = label.querySelector<HTMLSpanElement>(
          "div.newnav > h3 > a > span",
        )?.textContent!;

        const bookImgEle = label.querySelector<HTMLImageElement>("a > img")!;
        const bookImgUrl = bookImgEle.src;

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

  /** 註冊菜單命令，點擊可批量打開所有更新書籍 */
  private registerOpenUpdateBookMenuCommand(bookData: BookData[]) {
    GM_registerMenuCommand(
      `${
        bookData.length === 0
          ? this.t("noUpdates")
          : `${bookData.length}${this.t("updatesAvailable")}`
      }`,
      () => {
        for (const data of bookData) {
          GM_openInTab(data.Updata.url.value);
        }
      },
    );
  }

  /** 輸出調試資訊 */
  private debugInfo() {
    return {
      IsBook: this.Site.Book.Is(),
      IsInfo: this.Site.Info.Is(),
      IsEnd: this.Site.End.Is(),
      IsBookshelf: this.Site.IsBookshelf(),
      HasBookinfo: this.Site.HasBookInfo,
      ...config,
    };
  }
}

// --- main --- //

/** 配置初始化 */
const config: Config = new Config();

/** i18n 設定 */
const i18nData: typeof I18n.prototype.langJson = {
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

const SiteList: Site[] = [new Site_tw(), new Site_69shuba()];
/** 初始化書籍管理器 */
new BookManager(SiteList.find((site) => site.isSite)!);

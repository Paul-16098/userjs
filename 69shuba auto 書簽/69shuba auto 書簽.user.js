"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      4.2.2
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
// @exclude      https://twkan.com/book/*/index.html
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
/** 用戶配置類，負責管理腳本的各項設置，並註冊菜單 */
class Config {
    /** 是否開啟偵錯模式 */
    Debug = GM_getValue("Debug", false);
    /** 結束頁是否自動關閉 */
    IsEndClose = GM_getValue("IsEndClose", true);
    /** 是否自動加入書櫃 */
    AutoAddBookcase = GM_getValue("AutoAddBookcase", true);
    /** 自動加入書櫃的封鎖名單(書ID陣列) */
    AutoAddBookcaseBlockade = GM_getValue("AutoAddBookcaseBlockade", []);
    /** 是否攔截alert */
    IsHookAlert = GM_getValue("IsHookAlert", true);
    /** 攔截alert的訊息封鎖名單 */
    HookAlertBlockade = GM_getValue("HookAlertBlockade", [
        // opencclint-disable
        ["添加成功"],
        ["刪除成功!"],
        ["恭喜您，该章节已经加入到您的书签！"],
        // opencclint-enable
    ]);
    /** 語言設定 */
    Language = GM_getValue("Language", "zh");
    constructor() {
        this.set();
        this.registerConfigMenu();
    }
    /** 註冊所有配置項的菜單 */
    registerConfigMenu() {
        for (const key in this) {
            const value = this[key];
            let menu = undefined;
            // 語言切換菜單
            if (Object.values(["zh", "en"]).includes(value)) {
                menu = () => {
                    for (const lang of Object.values(["zh", "en"])) {
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
                ...(this.Language == "zh"
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
    set() {
        GM_setValue("Debug", this.Debug);
        GM_setValue("IsEndClose", this.IsEndClose);
        GM_setValue("AutoAddBookcase", this.AutoAddBookcase);
        GM_setValue("AutoAddBookcaseBlockade", this.AutoAddBookcaseBlockade);
        GM_setValue("IsHookAlert", this.IsHookAlert);
        GM_setValue("HookAlertBlockade", this.HookAlertBlockade);
        GM_setValue("Language", this.Language);
    }
}
class Site_tw {
    SELECTORS = {
        nextPage: "#container > div.page1 > a:nth-child(4)",
        authorInfo: "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
        titleDiv: "body > div.container > div.mybox > div.tools",
        searchInput: "body > header > div > form > div > div.inputbox > input[type=text]",
        searchForm: "body > header > div > form",
        ElementNeedRemove: [
            "#pageheadermenu",
            "#container > div.mybox > h3",
            "#container > div.mybox > div.top_Scroll",
            "#pagefootermenu",
        ],
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
        // /book/91116.html
        pattern: /^\/book\/\d+\.html$/m,
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
    static isSite = location.host === "twkan.com";
}
class Site_69shuba {
    SELECTORS = {
        nextPage: "body > div.container > div.mybox > div.page1 > a:nth-child(4)",
        authorInfo: "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
        titleDiv: "body > div.container > div.mybox > div.tools",
        searchInput: "body > header > div > form > div > div.inputbox > input[type=text]",
        searchForm: "body > header > div > form",
        ElementNeedRemove: [
            "#pageheadermenu",
            "body > div.container > div.mybox > h3",
            "#pagefootermenu",
        ],
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
    static isSite = location.host === "www.69shuba.com";
}
class BookManager {
    Site;
    /** i18n 處理實例，用於管理當前語言與字典資料 */
    i18nInstance;
    /** 綁定的翻譯方法，避免 this 指向錯誤 */
    t;
    /** 取得下一頁的元素 */
    getNextPageElement() {
        const element = document.querySelector(this.Site.SELECTORS.nextPage);
        if (element?.href)
            return element;
        // 備用方案: 尋找文字為"下一章"的連結
        return Array.from(document.querySelectorAll("a")).find((link) => link.textContent === "下一章");
    }
    /** 構造函數，根據當前頁面自動分派對應處理 */
    constructor(Site) {
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
            if (search)
                this.performSearch(search);
            // #tag BookEnd
            if (this.Site.End.Is()) {
                if (config.Debug)
                    console.log("End page detected");
                if (config.IsEndClose)
                    window.close();
            }
            // #tag Info
            if (this.Site.Info.Is()) {
                if (config.Debug)
                    console.log("Book info page detected");
                document
                    .querySelector("body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a")
                    ?.click();
            }
            // #tag Book
            if (this.Site.Book.Is()) {
                if (config.Debug)
                    console.log("Book page detected");
                this.handleBookPage();
            }
            // #tag Bookshelf
            if (this.Site.IsBookshelf()) {
                if (config.Debug)
                    console.log("Bookshelf page detected");
                this.handleBookshelf();
            }
            // if not match any pattern
            if (!this.Site.Book.Is() &&
                !this.Site.Info.Is() &&
                !this.Site.IsBookshelf() &&
                !this.Site.End.Is()) {
                if (!config.Debug) {
                    alert(this.t("noMatchingPattern"));
                }
            }
        }
        catch (error) {
            if (!config.Debug) {
                alert(`${this.t("errorOccurred")}${String(error)}`);
            }
            throw error;
        }
    }
    /** 書頁自動化處理: 樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接 */
    handleBookPage() {
        if (config.IsHookAlert)
            this.hookAlert();
        this.addStyles("BookPageCss");
        this.modifyPageNavigation();
        this.Site.SELECTORS.ElementNeedRemove.forEach((selector) => {
            let o = document.querySelectorAll(selector);
            if (config.Debug)
                console.log(`Removing elements for selector: ${selector}`, o);
            if (o.length == 0) {
                if (config.Debug)
                    console.log(`No elements found for selector: ${selector}`);
            }
            o.forEach((ele) => {
                ele.remove();
            });
        });
        if (config.AutoAddBookcase)
            this.addToBookcase();
        this.insertAuthorLink();
        this.updateNextPageLink();
        this.replaceText();
        GM_registerMenuCommand(this.t("ReplaceNow"), this.replaceText);
    }
    /** 替換文本內容，根據替換字典進行替換 */
    replaceText() {
        if (this.Site instanceof Site_tw) {
            const ele = document.querySelector("#txtcontent0");
            const RawStrReplace = GM_getResourceText("StrReplace");
            if (config.Debug)
                console.log("raw_replace_json: ", RawStrReplace);
            const StrReplace = JSON.parse(RawStrReplace);
            if (config.Debug)
                console.log("replace_json: ", StrReplace);
            for (const value of StrReplace) {
                ele.innerText = ele.innerText.replaceAll(value, "");
            }
            const RawRegReplace = GM_getResourceText("RegReplace");
            if (config.Debug)
                console.log("raw_reg_replace_json: ", RawRegReplace);
            const StrRegReplace = JSON.parse(RawRegReplace);
            const RegReplace = [];
            StrRegReplace.forEach((pattern) => {
                RegReplace.push(new RegExp(pattern, "g"));
            });
            if (config.Debug)
                console.log("reg_replace_json: ", RegReplace);
            for (const pattern of RegReplace) {
                ele.innerText = ele.innerText.replaceAll(pattern, "");
            }
        }
    }
    /** 自動加入書櫃(如未在封鎖名單) */
    addToBookcase() {
        const aid = this.Site.Book.GetAid();
        if (config.AutoAddBookcaseBlockade.includes(aid)) {
            console.log("Book is in the blockade list, not auto adding to bookcase.");
        }
        else {
            this.addBookcase();
        }
    }
    /** 更新下一頁鏈接，附加FromBook參數 */
    updateNextPageLink() {
        const nextPageEle = this.getNextPageElement();
        if (nextPageEle) {
            const href = new URL(nextPageEle.href);
            href.searchParams.set("FromBook", "true");
            nextPageEle.href = href.toString();
        }
    }
    /** 攔截全局alert，根據封鎖名單過濾 */
    hookAlert() {
        const _alert = alert;
        unsafeWindow.alert = (...message) => {
            if (!config.HookAlertBlockade.some((blockade) => JSON.stringify(message) === JSON.stringify(blockade) ||
                JSON.stringify(blockade) === "*")) {
                _alert(...message);
            }
            if (config.Debug)
                console.log("Alert message:", message);
        };
    }
    /** 注入自定義CSS樣式 */
    addStyles(name) {
        const css = GM_getResourceText(name);
        const style = GM_addStyle(css);
        if (config.Debug)
            console.log(`CSS ${name} added`, style);
    }
    /** 移除原有onkeydown，註冊自定義鍵盤導航 */
    modifyPageNavigation() {
        document.onkeydown = null;
        addEventListener("keydown", this.keydownHandler.bind(this));
    }
    /** 處理右鍵導航與結束自動關閉 */
    keydownHandler(e) {
        if (!e.repeat && e.key === "ArrowRight") {
            const nextPageLink = document.querySelector(this.Site.SELECTORS.nextPage).href;
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
    addBookcase() {
        if (addbookcase.toString().includes("Ajax.Tip")) {
            const addBookcaseLink = document.querySelector("#a_addbookcase");
            addBookcaseLink?.click();
        }
        else {
            const aid = this.Site.Book.GetAid();
            const cid = this.Site.Book.GetCid();
            addbookcase(aid, cid);
        }
    }
    /** 替換標題div為帶有作者連結的新元素 */
    insertAuthorLink() {
        if (config.Debug)
            console.log("Inserting author link");
        let author = this.Site.HasBookInfo
            ? bookinfo.author
            : (document
                .querySelector(this.Site.SELECTORS.authorInfo)
                ?.textContent?.trim()
                .split(" ")[1] ?? "undefined");
        const titleDiv = document.querySelector(this.Site.SELECTORS.titleDiv);
        if (titleDiv) {
            const titleLink = this.createTitleLink();
            titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
        }
        const authorLink = this.createAuthorLink(author);
        let oal = document.querySelector(this.Site.SELECTORS.authorInfo);
        oal.parentNode.replaceChild(authorLink, oal);
        if (config.Debug)
            console.log("Author link inserted");
    }
    /** 建立作者頁面連結元素 */
    createAuthorLink(author) {
        const authorLink = document.createElement("a");
        if (this.Site instanceof Site_tw) {
            authorLink.href = `https://twkan.com/author/${author}.html`;
        }
        else {
            authorLink.href = `${globalThis.location.origin}/modules/article/author.php?author=${author}`;
        }
        authorLink.textContent = "作者:  " + author;
        authorLink.style.color = "#007ead";
        return authorLink;
    }
    /** 建立書名連結元素 */
    createTitleLink() {
        if (config.Debug)
            console.log("Creating title link");
        const titleLink = document.createElement("a");
        titleLink.innerHTML = this.Site.HasBookInfo
            ? (bookinfo.articlename ?? document.title.split("-")[0])
            : document.title.split("-")[0];
        titleLink.classList.add("userjs_add");
        titleLink.id = "title";
        titleLink.href = `${globalThis.location.origin}/book/${this.Site.Book.GetAid()}${this.Site instanceof Site_tw ? "/index.html" : ".htm"}`;
        if (config.Debug)
            console.log("Title link created:", titleLink);
        return titleLink;
    }
    /** 書架頁面: 收集書籍資料並註冊菜單 */
    async handleBookshelf() {
        const bookData = await this.collectBookData();
        if (config.Debug)
            console.log("Bookshelf data collected", bookData);
        this.registerOpenUpdateBookMenuCommand(bookData);
    }
    /** 搜尋功能: 自動填入並提交表單 */
    performSearch(search) {
        const searchInput = document.querySelector(this.Site.SELECTORS.searchInput);
        const searchForm = document.querySelector(this.Site.SELECTORS.searchForm);
        if (searchInput && searchForm) {
            searchInput.value = search;
            searchForm.submit();
        }
        else {
            throw new Error("Search input or form not found");
        }
    }
    /** 遞迴收集書架書籍資料，最多重試5次 */
    async collectBookData(retryCount = 0) {
        const books = [];
        const labels = document.querySelectorAll("[id^='book_']");
        if (config.Debug)
            console.groupCollapsed("collectBookData");
        if (labels.length === 0) {
            if (retryCount <= 5) {
                console.warn(this.t("noLabelsFound"));
                await new Promise((resolve) => setTimeout(resolve, 5000));
                return this.collectBookData(retryCount + 1);
            }
            else {
                console.error(this.t("maxRetriesReached"));
                return []; // 到達最大重試次數, 返回空陣列
            }
        }
        if (config.Debug) {
            console.log(labels);
        }
        labels.forEach((label) => {
            const bookContainer = label;
            if (Array.from(label.querySelectorAll("label")).some((label) => label.textContent === "更新")) {
                const bookContinueEle = label.querySelector("div.newright > a.btn.btn-tp");
                const bookContinueLink = bookContinueEle.href;
                const BookName = label.querySelector("div.newnav > h3 > a > span")?.textContent;
                const bookImgEle = label.querySelector("a > img");
                const bookImgUrl = bookImgEle.src;
                const push_data = {
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
        if (config.Debug)
            console.groupEnd();
        return books;
    }
    /** 註冊菜單命令，點擊可批量打開所有更新書籍 */
    registerOpenUpdateBookMenuCommand(bookData) {
        GM_registerMenuCommand(`${bookData.length === 0
            ? this.t("noUpdates")
            : `${bookData.length}${this.t("updatesAvailable")}`}`, () => {
            for (const data of bookData) {
                GM_openInTab(data.Updata.url.value);
            }
        });
    }
    /** 輸出調試資訊 */
    debugInfo() {
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
const config = new Config();
/** i18n 設定 */
const i18nData = {
    en: {
        noMatchingPattern: "No matching URL pattern found",
        errorOccurred: "An error occurred: ",
        noLabelsFound: "No labels found, retrying in 5 seconds...",
        maxRetriesReached: "Max retries reached. No labels found.",
        noUpdates: "No updates",
        updatesAvailable: " updates available",
        ReplaceNow: "Replace now",
    },
    zh: {
        noMatchingPattern: "未找到匹配的 URL 模式",
        errorOccurred: "發生了一些錯誤: ",
        noLabelsFound: "未找到標籤，5 秒後重試...",
        maxRetriesReached: "已達到最大重試次數。未找到標籤。",
        noUpdates: "沒有更新",
        updatesAvailable: "個更新",
        ReplaceNow: "立即替換",
    },
};
const SiteList = [Site_tw, Site_69shuba];
// @ts-ignore-next-line
let currentSite = new (SiteList.find((site) => site.isSite))();
/** 初始化書籍管理器 */
new BookManager(currentSite);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNjlzaHViYSBhdXRvIOabuOewvS51c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiNjlzaHViYSBhdXRvIOabuOewvS51c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxREFBcUQ7QUFDckQsaUJBQWlCO0FBQ2pCLGdDQUFnQztBQUNoQywyQkFBMkI7QUFDM0Isc0JBQXNCO0FBQ3RCLHdDQUF3QztBQUN4QywyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCLGdEQUFnRDtBQUNoRCxzRUFBc0U7QUFDdEUsbURBQW1EO0FBQ25ELGlCQUFpQjtBQUNqQiwwQ0FBMEM7QUFDMUMsNENBQTRDO0FBQzVDLDhDQUE4QztBQUM5QyxvREFBb0Q7QUFFcEQsNEVBQTRFO0FBQzVFLDZCQUE2QjtBQUM3Qiw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1Qiw2QkFBNkI7QUFDN0IsdUNBQXVDO0FBQ3ZDLDZCQUE2QjtBQUM3QixtQ0FBbUM7QUFDbkMsOEJBQThCO0FBRTlCLFdBQVc7QUFDWCw2RUFBNkU7QUFDN0Usd0dBQXdHO0FBQ3hHLHFHQUFxRztBQUNyRyxxR0FBcUc7QUFDckcsT0FBTztBQUNQLDRFQUE0RTtBQUM1RSxzSUFBc0k7QUFDdEksd0hBQXdIO0FBQ3hILHdIQUF3SDtBQUN4SCxRQUFRO0FBRVIsb0JBQW9CO0FBQ3BCLDZEQUE2RDtBQUM3RCwrREFBK0Q7QUFDL0Qsa0JBQWtCO0FBRWxCLDhCQUE4QjtBQUM5QixNQUFNLE1BQU07SUFDWCxlQUFlO0lBQ2YsS0FBSyxHQUFZLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsZ0JBQWdCO0lBQ2hCLFVBQVUsR0FBWSxXQUFXLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RELGVBQWU7SUFDZixlQUFlLEdBQVksV0FBVyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hFLHlCQUF5QjtJQUN6Qix1QkFBdUIsR0FB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
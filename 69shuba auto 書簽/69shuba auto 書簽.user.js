"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.16.0
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
// #@require file://c:\Users\pl816\OneDrive\文件\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif
// @resource     BookPageCss https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/BookPage.user.css
// @resource     replace_json https://github.com/Paul-16098/userjs/raw/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/replace.json
// @license      MIT
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==
// 語言選項枚舉
var Language;
(function (Language) {
    Language["en"] = "en";
    Language["zh"] = "zh";
})(Language || (Language = {}));
/**
 * 用戶配置類，負責管理腳本的各項設置，並註冊菜單。
 */
class Config {
    /** 是否開啟偵錯模式 */
    Debug = GM_getValue("Debug", false);
    /** 結束頁是否自動關閉 */
    IsEndClose = GM_getValue("IsEndClose", true);
    /** 是否自動加入書櫃 */
    AutoAddBookcase = GM_getValue("AutoAddBookcase", true);
    /** 自動加入書櫃的封鎖名單（書ID陣列） */
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
    Language = GM_getValue("Language", Language.zh);
    constructor() {
        this.set();
        this.registerConfigMenu();
    }
    /**
     * 註冊所有配置項的菜單
     */
    registerConfigMenu() {
        for (const key in this) {
            const value = this[key];
            let menu = undefined;
            // 語言切換菜單
            if (Object.values(Language).includes(value)) {
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
    /**
     * 將當前配置寫入GM存儲
     */
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
// 配置初始化
const config = new Config();
// i18n 設定
const i18nData = {
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
class BookManager {
    /** 常用選擇器集合 */
    SELECTORS = {
        nextPage: [
            "body > div.container > div.mybox > div.page1 > a:nth-child(4)",
            "body > div.mainbox > div > div.page1 > a:nth-child(4)",
        ],
        authorInfo: "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",
        titleDiv: "body > div.container > div.mybox > div.tools",
        searchInput: "body > header > div > form > div > div.inputbox > input[type=text]",
        searchForm: "body > header > div > form",
    };
    /**
     * 各種頁面判斷與數據獲取方法集合
     */
    data = {
        // 判斷是否有書籍信息
        HasBookInfo: typeof bookinfo !== "undefined",
        // 判斷是否在書架頁面
        IsBookshelf: (href = location.href) => {
            if (this.data.IsTwkan) {
                return new URL(href).pathname === "/bookcase";
            }
            else {
                return new URL(href).pathname === "/modules/article/bookcase.php";
            }
        },
        // 書籍相關操作
        Book: {
            // 獲取書籍ID
            GetAid: (href = globalThis.location.href) => {
                if (this.data.HasBookInfo) {
                    return bookinfo.articleid;
                }
                return href.split("/")[4];
            },
            // 獲取章節ID
            GetCid: (href = globalThis.location.href) => {
                if (this.data.HasBookInfo) {
                    return bookinfo.chapterid;
                }
                return href.split("/")[5];
            },
            // 書籍URL模式
            pattern: /^\/(txt|c|r)\/(\d|[a-z])+\/(\d|[a-z])+(\.html)?$/m,
            // 判斷是否為書籍頁面
            Is: (href = globalThis.location.href) => {
                return this.data.Book.pattern.test(new URL(href).pathname);
            },
        },
        // 書籍信息相關操作
        Info: {
            // 書籍信息URL模式
            pattern: /^\/(book|b|article)\/(\d|[a-z])+\.htm(l)?$/m,
            tw_pattern: /^\/book\/\d+\/index\.html$/m,
            // 判斷是否為書籍信息頁面
            Is: (pathname = globalThis.location.pathname) => {
                return this.data.IsTwkan
                    ? this.data.Info.tw_pattern.test(pathname) ||
                        this.data.Info.pattern.test(pathname)
                    : this.data.Info.pattern.test(pathname);
            },
        },
        // 結束頁面相關操作
        End: {
            // 判斷是否為結束頁面
            Is: (href = globalThis.location.href) => {
                if (this.data.Info.Is()) {
                    const searchParams = new URL(href).searchParams;
                    return searchParams.get("FromBook") === "true";
                }
                if (this.data.IsTwkan) {
                    let h = new URL(href);
                    if (/txt\/\d+\/end\.html/.test(h.pathname) &&
                        h.searchParams.get("FromBook") === "true") {
                        return true;
                    }
                    else {
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
                    return (this.data.End.Is(nextUrl) ||
                        this.data.Info.Is(new URL(nextUrl).pathname));
                }
            }
            return false;
        },
        // 判斷是否為69shu.biz域名
        IsBiz: location.host === "69shu.biz",
        // 判斷是否為twkan.com域名
        IsTwkan: location.host === "twkan.com",
        NotAny: () => {
            return (!this.data.Book.Is() &&
                !this.data.Info.Is() &&
                !this.data.End.Is() &&
                !this.data.IsBookshelf());
        },
    };
    /** i18n 處理實例，用於管理當前語言與字典資料 */
    i18nInstance;
    /** 綁定的翻譯方法，避免 this 指向錯誤 */
    t;
    /**
     * 取得下一頁的元素
     */
    getNextPageElement() {
        for (const selector of this.SELECTORS.nextPage) {
            const element = document.querySelector(selector);
            if (element?.href)
                return element;
        }
        // 備用方案：尋找文字為"下一章"的連結
        return Array.from(document.querySelectorAll("a")).find((link) => link.textContent === "下一章");
    }
    /** 構造函數，根據當前頁面自動分派對應處理 */
    constructor() {
        this.i18nInstance = new I18n(i18nData, config.Language.toString());
        // 綁定 i18n 實例以確保 t 內部的 this 指向正確，避免在 BookManager 上下文中調用時出現 this.langList 錯誤
        this.t = this.i18nInstance.t.bind(this.i18nInstance);
        try {
            if (config.Debug) {
                console.debug(this.debugInfo());
            }
            // #tag search
            const search = new URLSearchParams(location.search).get("q");
            if (search)
                this.performSearch(search);
            // #tag BookEnd
            if (this.data.End.Is()) {
                if (config.Debug)
                    console.log("End page detected");
                if (config.IsEndClose)
                    window.close();
            }
            // #tag Info
            if (this.data.Info.Is()) {
                if (config.Debug)
                    console.log("Book info page detected");
                let Ele = document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a");
                if (Ele) {
                    Ele.click();
                }
            }
            // #tag Book
            if (this.data.Book.Is()) {
                if (config.Debug)
                    console.log("Book page detected");
                this.handleBookPage();
            }
            // #tag Bookshelf
            if (this.data.IsBookshelf()) {
                if (config.Debug)
                    console.log("Bookshelf page detected");
                this.handleBookshelf();
            }
            // if not match any pattern
            if (this.data.NotAny()) {
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
    /**
     * 書頁自動化處理：樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接
     */
    handleBookPage() {
        if (config.IsHookAlert)
            this.hookAlert();
        this.addStyles("BookPageCss");
        this.modifyPageNavigation();
        removeElement(".mytitle", ".top_Scroll", "#pagefootermenu", "body > div.container > div > div.yueduad1", "#pageheadermenu", ".bottom-ad2", "body > div.container > div.yuedutuijian.light");
        if (this.data.IsTwkan)
            removeElement("#container > br");
        if (config.AutoAddBookcase)
            this.AddToBookcase();
        this.insertAuthorLink();
        this.updateNextPageLink();
        if (this.data.IsTwkan) {
            const raw_replace_json = GM_getResourceText("replace_json");
            let replace_json = {};
            try {
                replace_json = JSON.parse(raw_replace_json);
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    if (config.Debug) {
                        console.log(error);
                    }
                    else {
                        alert(error);
                    }
                }
                else {
                    throw error;
                }
            }
            if (config.Debug) {
                console.log("replace_json: ", replace_json);
            }
            for (const key in replace_json) {
                if (Object.hasOwn(replace_json, key)) {
                    const element = replace_json[key];
                    if (document.querySelector("#txtcontent")) {
                        document.querySelector("#txtcontent").innerText = document.querySelector("#txtcontent").innerText.replaceAll(key, element);
                    }
                }
            }
        }
    }
    /**
     * 自動加入書櫃（如未在封鎖名單）
     */
    AddToBookcase() {
        const aid = this.data.Book.GetAid();
        if (config.AutoAddBookcaseBlockade.includes(aid)) {
            console.log("Book is in the blockade list, not auto adding to bookcase.");
        }
        else {
            this.addBookcase();
        }
    }
    /**
     * 更新下一頁鏈接，附加FromBook參數
     */
    updateNextPageLink() {
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
    /**
     * 注入自定義CSS樣式
     */
    addStyles(name) {
        const css = GM_getResourceText(name);
        GM_addStyle(css);
        if (config.Debug)
            console.log("CSS added");
    }
    /**
     * 移除原有onkeydown，註冊自定義鍵盤導航
     */
    modifyPageNavigation() {
        document.onkeydown = null;
        addEventListener("keydown", this.keydownHandler.bind(this));
    }
    /**
     * 處理右鍵導航與結束自動關閉
     */
    keydownHandler(e) {
        if (!e.repeat && e.key === "ArrowRight") {
            const nextPageLink = this.data.GetNextPageUrl();
            if (nextPageLink) {
                let href = new URL(nextPageLink);
                href.searchParams.set("FromBook", "true");
                globalThis.location.href = href.toString();
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
    addBookcase() {
        if (addbookcase.toString().includes("Ajax.Tip")) {
            const addBookcaseLink = document.querySelector("#a_addbookcase");
            addBookcaseLink?.click();
        }
        else {
            const aid = this.data.Book.GetAid();
            const cid = this.data.Book.GetCid();
            addbookcase(aid, cid);
        }
    }
    /**
     * 替換標題div為帶有作者連結的新元素
     */
    insertAuthorLink() {
        let author;
        if (bookinfo) {
            author = bookinfo.author;
        }
        else {
            author =
                document
                    .querySelector(this.SELECTORS.authorInfo)
                    ?.textContent?.trim()
                    .split(" ")[1] ?? "undefined";
        }
        const titleDiv = document.querySelector(this.SELECTORS.titleDiv);
        if (titleDiv) {
            const titleLink = this.createTitleLink();
            titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
        }
        const authorLink = this.createAuthorLink(author);
        let oal = document.querySelector("#container > div.mybox > div > div.txtinfo.hide720 > span:nth-child(2)");
        if (oal === null) {
            console.warn("insertAuthorLink:oal=null");
            return void 0;
        }
        document
            .querySelector("#container > div.mybox > div.txtnav > div.txtinfo.hide720")
            ?.replaceChild(authorLink, oal);
    }
    /**
     * 建立作者頁面連結元素
     */
    createAuthorLink(author) {
        const authorLink = document.createElement("a");
        if (this.data.IsTwkan) {
            authorLink.href = `https://twkan.com/author/${author}.html`;
        }
        else {
            authorLink.href = `${globalThis.location.origin}/modules/article/author.php?author=${encodeURIComponent(author)}`;
        }
        authorLink.textContent = "作者： " + author;
        authorLink.style.color = "#007ead";
        return authorLink;
    }
    /** 建立書名連結元素 */
    createTitleLink() {
        const titleLink = document.createElement("a");
        titleLink.innerHTML = this.data.HasBookInfo
            ? (bookinfo.articlename ?? document.title.split("-")[0])
            : document.title.split("-")[0];
        titleLink.classList.add("userjs_add");
        titleLink.id = "title";
        titleLink.href = `${globalThis.location.origin}/${this.data.IsBiz ? "b" : "book"}/${this.data.Book.GetAid()}.${this.data.IsBiz || this.data.IsTwkan ? "html" : "htm"}`;
        return titleLink;
    }
    /**
     * 書架頁面：收集書籍資料並註冊菜單
     */
    async handleBookshelf() {
        const bookData = await this.collectBookData();
        if (config.Debug)
            console.log("Bookshelf data collected", bookData);
        this.registerMenuCommand(bookData);
    }
    /**
     * 搜尋功能：自動填入並提交表單
     */
    performSearch(search) {
        const searchInput = document.querySelector(this.SELECTORS.searchInput);
        const searchForm = document.querySelector(this.SELECTORS.searchForm);
        if (searchInput && searchForm) {
            searchInput.value = search;
            searchForm.submit();
        }
    }
    /**
     * 遞迴收集書架書籍資料，最多重試5次
     */
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
            const tmp = (function () {
                if (Array.from(label.querySelectorAll("label")).some((label2) => label2.textContent === "更新")) {
                    const bookContinueEle = label.querySelector("div.newright > a.btn.btn-tp");
                    const bookContinueLink = bookContinueEle.href;
                    const BookName = label.querySelector("div.newnav > h3 > a > span")?.textContent;
                    const bookImgEle = label.querySelector("a > img");
                    const bookImgUrl = bookImgEle.src;
                    // }
                    return { bookContinueLink, BookName, bookImgUrl };
                }
                else {
                    return false;
                }
            })();
            if (tmp) {
                const { bookContinueLink, BookName, bookImgUrl } = tmp;
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
    /**
     * 註冊菜單命令，點擊可批量打開所有更新書籍
     */
    registerMenuCommand(bookData) {
        GM_registerMenuCommand(`${bookData.length === 0
            ? this.t("noUpdates")
            : `${bookData.length}${this.t("updatesAvailable")}`}`, () => {
            for (const data of bookData) {
                GM_openInTab(data.Updata.url.value);
            }
        });
    }
    /**
     * 輸出調試資訊
     */
    debugInfo() {
        return {
            IsBook: this.data.Book.Is(),
            IsInfo: this.data.Info.Is(),
            IsEnd: this.data.End.Is(),
            IsNextEnd: this.data.IsNextEnd(),
            IsBookshelf: this.data.IsBookshelf(),
            HasBookinfo: this.data.HasBookInfo,
            IsBiz: this.data.IsBiz,
            IsTwkan: this.data.IsTwkan,
            ...config,
        };
    }
}
if (config.Debug)
    debugger;
// 初始化書籍管理器
const bookManager = new BookManager();
//# sourceMappingURL=69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js.map
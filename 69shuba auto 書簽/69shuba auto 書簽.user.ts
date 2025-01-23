/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.3.0
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
// @require      https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// #@require      C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.css
// @license      MIT
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==

// 配置接口
interface Config {
  Debug: boolean;
  IsEndClose: boolean;
  AutoAddBookcase: boolean;
  IsHookAlert: boolean;
  HookAlertBlockade: Array<Array<any>>;
}

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
    Book_HTML_obj: Element;
    BookImgUrl: string;
  };
}

// 配置初始化
const config: Config = {
  Debug: GM_getValue("Debug", false),
  IsEndClose: GM_getValue("IsEndClose", true),
  AutoAddBookcase: GM_getValue("AutoAddBookcase", true),
  IsHookAlert: GM_getValue("IsHookAlert", true),
  HookAlertBlockade: GM_getValue("HookAlertBlockade", [
    ["添加成功"],
    ["刪除成功!"],
  ]),
};

class BookManager {
  private data = {
    // 判斷是否有書籍信息
    HasBookInfo: () => typeof bookinfo !== "undefined",
    // 判斷是否在書架頁面
    IsBookshelf: (href: string = window.location.href) => {
      return new URL(href).pathname === "/modules/article/bookcase.php";
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
        return false;
      },
    },
    // 獲取下一頁URL
    GetNextPageUrl: () => {
      let ele = document.querySelector(
        "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
      ) as HTMLAnchorElement | null;
      if (ele && ele.href !== null) {
        return ele.href;
      }
      ele = document.querySelector(
        "body > div.mainbox > div > div.page1 > a:nth-child(4)"
      ) as HTMLAnchorElement | null;
      if (ele && ele.href !== null) {
        return ele.href;
      }
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
  };

  constructor() {
    try {
      this.registerConfigMenu();
      if (this.data.Book.Is()) {
        if (config.Debug) console.log("Book page detected");
        this.handleBookPage();
      }
      if (this.data.Info.Is()) {
        if (config.Debug) console.log("Book info page detected");
        (
          document.querySelector(
            "body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a"
          ) as HTMLAnchorElement
        ).click();
      }
      if (this.data.End.Is()) {
        if (config.Debug) console.log("End page detected");
        if (config.IsEndClose) window.close();
      }
      if (this.data.IsBookshelf()) {
        if (config.Debug) console.log("Bookshelf page detected");
        this.handleBookshelf();
      }
      if (
        !this.data.Book.Is() &&
        !this.data.Info.Is() &&
        !this.data.End.Is() &&
        !this.data.IsBookshelf()
      ) {
        console.table(this.debugInfo());
        alert("No matching URL pattern found");
      } else if (config.Debug) {
        console.table(this.debugInfo());
      }
    } catch (error) {
      console.error(error);
      if (!config.Debug) {
        alert(error);
      }
    }
  }

  // 處理書籍頁面
  private handleBookPage() {
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
    if (config.AutoAddBookcase) this.addBookcase();
    this.insertAuthorLink();
    const nextPageEle = document.querySelector(
      "body > div.mainbox > div > div.page1 > a:nth-child(4)"
    ) as HTMLAnchorElement | null;
    let href = new URL(nextPageEle!.href);
    href.searchParams.set("FromBook", "true");
    nextPageEle!.href = href.toString();
  }

  // 攔截alert函數
  private hookAlert() {
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

  // 添加樣式
  private addStyles() {
    const css1 = GM_getResourceText("css1");
    GM_addStyle(css1);
    if (config.Debug) console.log("CSS added");
  }

  // 修改頁面導航
  private modifyPageNavigation() {
    document.onkeydown = null;
    addEventListener("keydown", this.keydownHandler.bind(this));
  }

  // 處理鍵盤事件
  private keydownHandler(e: KeyboardEvent) {
    if (!e.repeat && e.key === "ArrowRight") {
      const nextPageLink = this.data.GetNextPageUrl();
      if (nextPageLink) {
        let href = new URL(nextPageLink);
        href.searchParams.set("FromBook", "true");
        window.location.href = href.toString();
      }
    }
  }

  // 添加書籍到書架
  private addBookcase() {
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

  // 插入作者鏈接
  private insertAuthorLink() {
    const author =
      document
        .querySelector(
          "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)"
        )
        ?.textContent?.trim()
        .split(" ")[1] ?? "undefined";
    const authorLink = document.createElement("a");
    authorLink.href = `${
      window.location.origin
    }/modules/article/author.php?author=${encodeURIComponent(author)}`;
    authorLink.textContent = author;
    authorLink.style.color = "#007ead";

    const titleDiv = document.querySelector(
      "body > div.container > div.mybox > div.tools"
    ) as HTMLDivElement;
    if (titleDiv) {
      const titleLink = document.createElement("a");
      titleLink.innerHTML = this.data.HasBookInfo()
        ? bookinfo.articlename ?? document.title.split("-")[0]
        : document.title.split("-")[0];
      titleLink.classList.add("userjs_add");
      titleLink.id = "title";
      titleLink.href = `${window.location.origin}/${
        this.data.IsBiz() ? "b" : "book"
      }/${this.data.Book.GetAid()}.${this.data.IsBiz() ? "html" : "htm"}`;
      titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
    }
  }

  // 處理書架頁面
  private async handleBookshelf() {
    const bookData = await this.collectBookData();
    if (config.Debug) console.log("Bookshelf data collected", bookData);
    this.registerMenuCommand(bookData);
  }

  // 收集書籍數據
  private async collectBookData(retryCount = 0): Promise<BookData[]> {
    const books: Array<BookData> = [];
    const labels = document.querySelectorAll("[id^='book_']");
    console.groupCollapsed("collectBookData");
    if (labels.length === 0) {
      if (retryCount <= 5) {
        console.warn("No labels found, retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.collectBookData(retryCount + 1);
      } else {
        console.error("Max retries reached. No labels found.");
        return []; // 到達最大重試次數，返回空陣列
      }
    }
    if (config.Debug) {
      console.log(labels);
    }
    labels.forEach((label) => {
      const bookContainer = label;

      const bookUpdate = label.querySelector(
        "div.newright > a.btn.btn-tp"
      ) as HTMLAnchorElement;
      const bookUpdateLink = bookUpdate.href;

      const BookName = (
        label.querySelector("div.newnav > h3 > a > span") as HTMLSpanElement
      ).textContent as string;

      const bookImg = label.querySelector("a > img") as HTMLImageElement;
      const bookImgUrl = bookImg.src;

      const push_data: BookData = {
        Updata: {
          url: {
            value: bookUpdateLink,
            URLParams: new URLSearchParams(bookUpdateLink),
          },
        },
        Mate: {
          BookName: BookName,
          Book_HTML_obj: bookContainer,
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
    });
    console.groupEnd();
    return books;
  }

  // 註冊菜單命令
  private registerMenuCommand(bookData: BookData[]) {
    GM_registerMenuCommand(
      `${bookData.length === 0 ? "沒有" : `有${bookData.length}個`}更新`,
      () => {
        bookData.forEach((data) => {
          GM_openInTab(data.Updata.url.value);
        });
      }
    );
  }

  // 調試信息
  private debugInfo() {
    return {
      IsBook: this.data.Book.Is(),
      IsInfo: this.data.Info.Is(),
      IsEnd: this.data.End.Is(),
      IsNextEnd: this.data.IsNextEnd(),
      IsBookshelf: this.data.IsBookshelf(),
      HasBookinfo: this.data.HasBookInfo(),
      IsBiz: this.data.IsBiz(),
      ...config,
    };
  }

  // 註冊配置菜單
  private registerConfigMenu() {
    for (const key in config) {
      const value = config[key as keyof Config];
      if (typeof value == "boolean") {
        setMenu(key);
      }
    }
  }
}

// 初始化書籍管理器
const bookManager = new BookManager();

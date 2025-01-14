/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.0.0
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

interface Config {
  Debug: boolean;
  IsEndClose: boolean;
  AutoAddBookcase: boolean;
  IsHookAlert: boolean;
  HookAlertBlockade: Array<Array<any>>;
}

interface BookData {
  Updata: {
    HTML_obj: Element;
    url: {
      value: string;
      URLParams: {
        obj: URLSearchParams;
      };
    };
  };
  Mark: {
    HTML_obj: Element;
    url: {
      value: string;
      URLParams: {
        obj: URLSearchParams;
      };
    };
  };
  BookMate: {
    BookName: string;
    Book_HTML_obj: Element;
    BookImgUrl: string;
  };
}

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
  private data: {
    HasBookInfo: () => boolean;
    IsBookshelf: (href?: string) => boolean;
    Book: {
      GetAid: (href?: string) => string;
      GetCid: (href?: string) => string;
      pattern: RegExp;
      Is: (href?: string) => boolean;
    };
    Info: {
      pattern: RegExp;
      Is: (pathname?: string) => boolean;
    };
    End: {
      Is: (href?: string) => boolean;
    };
    GetNextPageUrl: () => string | undefined;
    IsNextEnd: () => boolean;
    IsBiz: (host?: string) => boolean;
  };

  constructor() {
    this.data = {
      HasBookInfo: () => typeof bookinfo !== "undefined",
      IsBookshelf: (href: string = window.location.href) => {
        return new URL(href).pathname === "/modules/article/bookcase.php";
      },
      Book: {
        GetAid: (href: string = window.location.href) => {
          if (this.data.HasBookInfo()) {
            return bookinfo.articleid;
          }
          return href.split("/")[4];
        },
        GetCid: (href: string = window.location.href) => {
          if (this.data.HasBookInfo()) {
            return bookinfo.chapterid;
          }
          return href.split("/")[5];
        },
        pattern: /^\/(txt|c|r)\/([0-9]|[a-z])+\/([0-9]|[a-z])+(\.html)?$/m,
        Is: (href: string = window.location.href) => {
          return this.data.Book.pattern.test(new URL(href).pathname);
        },
      },
      Info: {
        pattern: /^\/(book|b|article)\/([0-9]|[a-z])+\.htm(l)?$/m,
        Is: (pathname: string = window.location.pathname) => {
          return this.data.Info.pattern.test(pathname);
        },
      },
      End: {
        Is: (href: string = window.location.href) => {
          if (this.data.Info.Is()) {
            const searchParams = new URL(href).searchParams;
            return searchParams.get("FromBook") === "true";
          }
          return false;
        },
      },
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
      IsBiz: (host: string = location.host) => {
        return host === "69shu.biz";
      },
    };
  }

  run() {
    this.registerConfigMenu();
    if (this.data.Book.Is()) {
      this.handleBookPage();
    } else if (this.data.Info.Is()) {
      // Handle info page
    } else if (this.data.End.Is()) {
      if (config.IsEndClose) window.close();
    } else if (this.data.IsBookshelf()) {
      this.handleBookshelf();
    }
    if (
      config.Debug &&
      !this.data.Book.Is() &&
      !this.data.Info.Is() &&
      !this.data.End.Is() &&
      !this.data.IsBookshelf()
    ) {
      console.error("No matching URL pattern found");
      console.table(this.debugInfo());
    }
  }

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
  }

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

  private addStyles() {
    const css1 = GM_getResourceText("css1");
    GM_addStyle(css1);
    if (config.Debug) console.log("CSS added");
  }

  private modifyPageNavigation() {
    document.onkeydown = null;
    addEventListener("keydown", this.keydownHandler.bind(this));
  }

  private keydownHandler(e: KeyboardEvent) {
    if (!e.repeat && e.key === "ArrowRight") {
      const nextPageLink = this.data.GetNextPageUrl();
      if (nextPageLink) {
        window.location.href = nextPageLink;
      }
    }
  }

  private addBookcase() {
    const aid = this.data.Book.GetAid();
    const cid = this.data.Book.GetCid();
    if (addbookcase.toString().includes("addbookcase.php")) {
      addbookcase(aid, cid);
    } else {
      const addBookcaseLink = document.querySelector(
        "#a_addbookcase"
      ) as HTMLElement | null;
      addBookcaseLink?.click();
    }
  }

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
      }/${this.data.Book.GetAid()}.${
        this.data.IsBiz() ? "html" : "htm"
      }?FormTitle=false`;
      titleDiv.parentNode?.replaceChild(titleLink, titleDiv);
    }
  }

  private handleBookshelf() {
    const bookData = this.collectBookData();
    if (config.Debug) console.log("Bookshelf data collected", bookData);
    this.registerMenuCommand(bookData);
  }

  private collectBookData(): BookData[] {
    const books: BookData[] = [];
    document.querySelectorAll(".newbox2 h3 label").forEach((label) => {
      const bookContainer = label.parentNode?.parentNode?.parentNode
        ?.parentNode as Element;
      const bookName =
        bookContainer.querySelector("div > h3 > a > span")?.textContent ?? "";
      const bookImgUrl =
        (bookContainer.querySelector("a > img") as HTMLImageElement)?.src ?? "";
      const bookMarkLink =
        bookContainer
          .querySelectorAll("div")[1]
          .querySelectorAll("p")[0]
          .querySelector("a")?.href ?? "";
      const bookUpdateLink =
        bookContainer
          .querySelectorAll("div")[1]
          .querySelectorAll("p")[1]
          .querySelector("a")?.href ?? "";

      books.push({
        Updata: {
          HTML_obj: bookContainer
            .querySelectorAll("div")[1]
            .querySelectorAll("p")[1],
          url: {
            value: bookUpdateLink,
            URLParams: {
              obj: new URLSearchParams(bookUpdateLink),
            },
          },
        },
        Mark: {
          HTML_obj: bookContainer
            .querySelectorAll("div")[1]
            .querySelectorAll("p")[0],
          url: {
            value: bookMarkLink,
            URLParams: {
              obj: new URLSearchParams(bookMarkLink),
            },
          },
        },
        BookMate: {
          BookName: bookName,
          Book_HTML_obj: bookContainer,
          BookImgUrl: bookImgUrl,
        },
      });
    });
    return books;
  }

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
  private registerConfigMenu() {
    for (const key in config) {
      const value = config[key as keyof Config];
      if (typeof value == "boolean") {
        setMenu(key);
      }
    }
  }
}

try {
  const bookManager = new BookManager();
  bookManager.run();
} catch (error) {
  console.error(error);
  if (!config.Debug) {
    alert(error);
  }
}

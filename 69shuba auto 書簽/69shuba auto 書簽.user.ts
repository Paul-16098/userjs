/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.7.0-beta1
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
  Search: string;
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
  Search: GM_getValue("Search", "q"),
};

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

  /**
   * 初始化類別的新實例。
   *
   * 此構造函數執行以下操作：
   * - 註冊配置選單。
   * - 檢查目前頁面是否為圖書頁面、圖書資訊頁面、結束頁面或書架頁面, 並相應地處理每種情況。
   * - 如果設定了 `config.Debug` 標誌, 則記錄偵錯資訊。
   * - 如果找不到符合的 URL 模式, 則提醒使用者。
   * - 擷取並記錄執行期間發生的任何錯誤。
   *
   * @throws 如果發生錯誤且未設定 `config.Debug` , 將提醒使用者。
   */
  constructor() {
    try {
      this.registerConfigMenu();
      if (this.data.Book.Is()) {
        if (config.Debug) console.log("Book page detected");
        this.handleBookPage();
      }
      if (this.data.Info.Is()) {
        if (config.Debug) console.log("Book info page detected");
        let Ele = document.querySelector(
          "body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a"
        ) as HTMLAnchorElement | null;
        if (Ele) {
          Ele.click();
        }
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

  /**
   * 通過執行各種修改和增強來處理書頁。
   *
   *  - 如果啟用了 `config.IsHookAlert` , 則不顯示`alert`。
   *  - 將自定義樣式添加到頁面上。
   *  - 修改頁面導航元素。
   *  - 從頁面上刪除指定的元素。
   *  - 如果啟用了自動添加書架配置, 則將書添加到書架中。
   *  - 插入指向作者頁面的鏈接。
   *  - 更新下一頁鏈接以包含一個查詢參數, 該參數指示本書導航。
   *
   * @private
   * @returns {void}
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
    if (config.AutoAddBookcase) this.addBookcase();
    this.insertAuthorLink();
    let nextPageEle = document.querySelector(
      "body > div.mainbox > div > div.page1 > a:nth-child(4)"
    ) as HTMLAnchorElement | null;
    if (!nextPageEle) {
      nextPageEle = Array.from(document.querySelectorAll("a")).find(
        (link) => link.textContent === "下一章"
      ) as HTMLAnchorElement;
    }
    let href = new URL(nextPageEle!.href);
    href.searchParams.set("FromBook", "true");
    nextPageEle!.href = href.toString();
  }

  /**
   * 將掛接到全局 `alert` 函數中, 以有條件阻止或日誌警報消息。
   *
   * 此功能用自定義實現替換默認的 `alert` 函數, 該函數可根據 `config.HookAlertBlockade` 數組中定義的封鎖列表檢查每個警報消息。
   * 如果該消息與任何封鎖匹配（或者將封鎖設置為`*`）, 則該警報將被封鎖。
   * 否則, 該警報會照常顯示。
   *
   * 此外, 如果啟用了偵錯（`config.Debug`）, 警報訊息將記錄到控制枱。
   *
   * @private
   * @function hookAlert
   * @returns {void}
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
   * 透過從指定資源檢索 CSS 內容並將其註入到頁面中, 將自訂樣式新增至文件。如果在設定中啟用了偵錯, 則會向控制枱記錄一則訊息, 指示 CSS 已新增。
   *
   * @private
   * @returns {void}
   */
  private addStyles(): void {
    const css1 = GM_getResourceText("css1");
    GM_addStyle(css1);
    if (config.Debug) console.log("CSS added");
  }

  /**
   * 透過刪除任何現有的 `onkeydown` 事件處理程序並新增使用 `keydownHandler` 方法的新 `keydown` 事件偵聽器來修改頁面導覽。
   *
   * @private
   */
  private modifyPageNavigation(): void {
    document.onkeydown = null;
    addEventListener("keydown", this.keydownHandler.bind(this));
  }

  /**
   * 按下 `Arrowright` 鍵時, 處理鍵盤事件, 用於導航到下一頁。
   *
   * @param e - 鍵盤事件對象。
   *
   * 此方法執行以下操作：
   *  -檢查是否按下 `Arrowright` 鍵, 並且事件不是重複。
   *  -使用`this.data.GetNextPageUrl()`檢索下一頁的URL。
   *  -如果找到下一頁URL, 它將附加查詢參數`frombook = true`到URL並導航到它。
   *  -如果下一頁已結束並且設定了 `config.IsEndClose` 標誌, 則會關閉視窗。
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
   * 將目前書籍加入書櫃。
   *
   * 此方法從數據對像中檢索了本書的AID和CID, 並試圖將書添加到書架中。
   * 如果`addbookCase`函數不包含字符串“ ajax.tip”, 則用AID和CID調用`addBookCase`。
   * 否則, 它會模擬使用ID `A_ADDBOOKCASE` 的單擊元素, 以將書添加到書櫃中。
   *
   * @private
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
   * 插入作者連結並用新連結取代標題 div。
   * 此方法執行以下操作：
   * 1. 從指定的 DOM 元素中檢索作者姓名。
   * 2. 建立連結到作者頁面的錨元素並設定其文字內容和樣式。
   * 3. 找到標題 div 並將其替換為包含書名的新錨元素。
   * 新標題連結的 href 是根據該書是否是商業書籍構建的。
   * 標題文字是根據圖書資訊的存在而決定的。
   */
  private insertAuthorLink(): void {
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

  /**
   * 透過收集書籍資料並註冊選單命令來處理書架。
   *
   * @returns {Promise<void>} 當書架處理完成時, 這個承諾就得到解決。
   * @private
   */
  private async handleBookshelf(): Promise<void> {
    const search = new URLSearchParams(location.search).get(config.Search);
    if (search) {
      (
        document.querySelector(
          "body > header > div > form > div > div.inputbox > input[type=text]"
        ) as HTMLInputElement
      ).value = search;
      (
        document.querySelector("body > header > div > form") as HTMLFormElement
      ).submit();
    }
    const bookData = await this.collectBookData();
    if (config.Debug) console.log("Bookshelf data collected", bookData);
    this.registerMenuCommand(bookData);
  }

  /**
   * 透過查詢 ID 以 `book_` 開頭的元素, 從 DOM 收集圖書資料。
   * 如果未找到標籤, 則會重試最多 5 次, 每次重試之間有 5 秒的延遲。
   *
   * @param {number} [retryCount=0] - 目前重試次數。
   * @returns {Promise<BookData[]>} - 解決一系列收集的書籍數據的承諾。
   *
   * @remarks
   * - 如果達到最大重試次數而沒有找到任何標籤, 則傳回空數組。
   * - 如果啟用`config.Debug`, 則會將其他偵錯資訊記錄到控制枱。
   *
   * @private
   */
  private async collectBookData(retryCount: number = 0): Promise<BookData[]> {
    const books: Array<BookData> = [];
    const labels = document.querySelectorAll("[id^='book_']");
    if (config.Debug) console.groupCollapsed("collectBookData");
    if (labels.length === 0) {
      if (retryCount <= 5) {
        console.warn("No labels found, retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this.collectBookData(retryCount + 1);
      } else {
        console.error("Max retries reached. No labels found.");
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
      }
    });
    if (config.Debug) console.groupEnd();
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

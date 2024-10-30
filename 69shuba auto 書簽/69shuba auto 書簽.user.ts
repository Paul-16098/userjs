// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.4.1.0
// @description  自動書籤,更改css,可以在看書頁找到作者連結
// @author       Paul-16098
// #tag 69shux.com
// @match        https://69shux.com/txt/*/*
// @match        https://69shux.com/txt/*/end.html
// @match        https://69shux.com/book/*.htm*
// @match        https://69shux.com/modules/article/bookcase.php
// #tag www.69shu.top
// @match        https://www.69shu.top/txt/*/*
// @match        https://www.69shu.top/txt/*/end.html
// @match        https://www.69shu.top/book/*.htm*
// @match        https://www.69shu.top/modules/article/bookcase.php
// #tag www.69shu.cx
// @match        https://www.69shu.cx/txt/*/*
// @match        https://www.69shu.cx/txt/*/end.html
// @match        https://www.69shu.cx/book/*.htm*
// @match        https://www.69shu.cx/modules/article/bookcase.php
// #tag 69shuba.cx
// @match        https://69shuba.cx/txt/*/*
// @match        https://69shuba.cx/txt/*/end.html
// @match        https://69shuba.cx/book/*.htm*
// @match        https://69shuba.cx/modules/article/bookcase.php
// #tag www.69shuba.pro
// @match        https://www.69shuba.pro/txt/*/*
// @match        https://www.69shuba.pro/txt/*/end.html
// @match        https://www.69shuba.pro/book/*.htm*
// @match        https://www.69shuba.pro/modules/article/bookcase.php
// #tag 69shuba.cx
// @match        https://69shu.me/txt/*/*
// @match        https://69shu.me/txt/*/end.html
// @match        https://69shu.me/book/*.htm*
// @match        https://69shu.me/modules/article/bookcase.php
// #tag 69shuba.cx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @require      https://github.com/Paul-16098/vs_code/raw/dev/js/userjs/Tools/Tools.user.js
// #@require      file:///C:/Users/p/Documents/git/vs_code/js/userjs/Tools/Tools.user.js
// @license      MIT
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// ==/UserScript==
// https://github.com/scriptscat/scriptcat/issues/264
// ToDo 希望支持// @grant        window.close

const Debug: boolean = GM_getValue("Debug", false);
const IsEndClose: boolean = GM_getValue("IsEndClose", true);
const AutoAddBookcase: boolean = GM_getValue("AutoAddBookcase", true);
const IsHookAlert: boolean = GM_getValue("IsHookAlert", true);
const HookAlertBlockade: any[][] = GM_getValue("HookAlertBlockade", [
  ["添加成功"],
  ["删除成功!"],
]);

let data = {
  IsBookshelf: (href: string = window.location.href): boolean => {
    let pathname: string = new URL(href).pathname;
    return pathname === "/modules/article/bookcase.php";
  },
  Book: {
    get_aid: function (href: string = window.location.href): string {
      return bookinfo.articleid;
    },
    get_cid: function (href = window.location.href): string {
      return bookinfo.chapterid;
    },
    pattern: /^\/txt\/[0-9]+\/[0-9]+$/m,
    is: function (href: string = window.location.href): boolean {
      let pathname: string = new URL(href).pathname;
      return this.pattern.test(pathname);
    },
  },
  Info: {
    pattern: /^\/book\/[0-9]+\.htm$/m,
    is: function (href: string = window.location.href): boolean {
      let pathname: string = new URL(href).pathname;
      return this.pattern.test(pathname);
    },
  },
  End: {
    is: function (href: string = window.location.href): boolean {
      if (new URL(href).searchParams.get("FormTitle") === "false") {
        if (Debug) {
          console.log("b#searchParams.end;s#f");
        }
        return false;
      }
      if (new URL(href).searchParams.get("FromBook") === "true") {
        return data.Info.is(href);
      }
      console.warn("err-2");
      return false;
    },
  },
  GetNextPageUrl: (): string | undefined => {
    let ele = document.querySelector(
      "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
    ) as HTMLAnchorElement | null;
    if (ele) {
      if (ele.href !== null) {
        return ele.href;
      }
    }
  },
  IsNextEnd: function (): boolean {
    if (data.End.is(data.GetNextPageUrl())) {
      return true;
    }
    if (data.IsBookshelf(data.GetNextPageUrl())) {
      return false;
    }
    if (data.Book.is(data.GetNextPageUrl())) {
      return false;
    }
    if (Debug) {
      console.warn("err-1");
    }
    return false;
  },
};
if (GM_getValue("config.is_hook_alert", true)) {
  // #tag hook_alert
  const _alert: Function = alert;
  _unsafeWindow.alert = (...message: any) => {
    let blockade: any[][] = HookAlertBlockade;
    let r: boolean = false;
    let n: number = 0;
    blockade.forEach((blockade_ele) => {
      n++;
      if (
        JSON.stringify(message) === JSON.stringify(blockade_ele) ||
        JSON.stringify(blockade_ele) === "*"
      ) {
        console.log("hook alert: ", message);
        r = true;
      }
    });
    if (r === false) {
      if (Debug) {
        console.log("alert: ", message);
      }
      _alert(...message);
    }
  };
}

let ele: string[] = [];
if (data.Book.is()) {
  // #tag is_book
  if (Debug) {
    console.log("book");
  }
  if (Debug) {
    console.log("GM_addStyle start");
  }
  GM_addStyle(`#title {
    font-size: large;
    font-weight: bold;
    color: #000;
  }
  
  .container {
    margin: 0px !important;
    min-height: 0px !important;
    width: 100% !important;
    max-width: none !important;
  }
  
  .mybox {
    padding: 0px;
    margin: 0px;
  }
  `);
  if (Debug) {
    console.log("GM_addStyle end");
  }
  remove_ele(
    ".mytitle",
    ".top_Scroll",
    "#pagefootermenu",
    "body > div.container > div > div.yueduad1",
    "#pageheadermenu",
    ".bottom-ad2",
    "body > div.container > div.yuedutuijian.light"
  );

  if (AutoAddBookcase) {
    (document.querySelector("#a_addbookcase") as HTMLElement | null)?.click();
  } else if (Debug) {
    console.log("auto_bookcase !== true");
  }
  let author: string = "undefined";
  if ((typeof bookinfo === "undefined" || bookinfo) ?? false) {
    author =
      document
        .querySelector(
          "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)"
        )
        ?.textContent?.trim()
        .split(" ")[1] ?? "undefined"; // 網站原有的變量
  }
  let aElement = document.createElement("a");
  aElement.href = `${window.location.origin}/modules/article/author.php?author=${author}`;
  aElement.textContent = author;
  aElement.style.color = "#007ead";

  // let divElement: HTMLDivElement = document.querySelector(
  //   "#txtright"
  // ) as HTMLDivElement;
  // divElement.textContent = "";
  // divElement.appendChild(aElement);

  let title: HTMLDivElement = document.querySelector(
    "body > div.container > div.mybox > div.tools"
  ) as HTMLDivElement;
  // 創建新的 <a> 元素
  let link = document.createElement("a");

  // 設置 <a> 元素的內容為 bookinfo.articlename
  if ((typeof bookinfo != "undefined" && bookinfo) ?? false) {
    if (Debug) {
      console.log("user bookinfo.articlename");
    }
    link.innerHTML =
      bookinfo.articlename ??
      document.querySelector("head > title")!.innerHTML.split("-")[0];
  } else {
    if (Debug) {
      console.log("from head>title get title");
    }
    link.innerHTML = document
      .querySelector("head > title")!
      .innerHTML.split("-")[0];
  }

  // 添加 <a> 元素的類名為 "userjs_add"
  link.classList.add("userjs_add");

  // 設置 <a> 元素的 id 為 "title"
  link.id = "title";

  // 設置 <a> 元素的 href
  link.href = `${
    window.location.origin
  }/book/${data.Book.get_aid()}.htm?FormTitle=false`;

  // 將 <a> 元素插入到 title 的父元素中
  title?.parentNode?.replaceChild(link, title);

  let ele = document.querySelector(
    "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
  ) as HTMLAnchorElement;
  ele.href += "?FromBook=true";
}
if (data.Info.is()) {
  // #tag is_info
  if (Debug) {
    console.log("info");
  }
}
if (data.End.is()) {
  // #tag is_end
  if (Debug) {
    console.log("end");
  }
  if (IsEndClose) {
    window.close();
  }
}
if (data.Book.is()) {
  if (data.IsNextEnd()) {
    // #tag is_next_end
    if (Debug) {
      console.log("next_is_end");
    }
    document.addEventListener("keydown", function (e) {
      if (!e.repeat) {
        switch (true) {
          case e.key === "ArrowRight": {
            if (Debug) {
              console.log('(e.key === "ArrowRight") === true');
            }
            if (IsEndClose) {
              window.close();
            }
            break;
          }
          default: {
            if (Debug) {
              console.log("e: ", e);
            }
            break;
          }
        }
      }
    });
    (
      document.querySelector(
        "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
      ) as HTMLAnchorElement | null
    )?.addEventListener("click", function () {
      if (Debug) {
        console.log("click");
      }
      if (AutoAddBookcase) {
        (
          document.querySelector("#a_addbookcase") as HTMLAnchorElement | null
        )?.click();
      } else if (Debug) {
        console.log("auto_bookcase !== true");
      }
      if (IsEndClose) {
        window.close();
      }
    });
  }
}
if (data.IsBookshelf()) {
  // #tag is_bookshelf
  interface Type__BookData {
    updata: {
      HTML_obj: Element;
      url: {
        value: string;
        URLParams: {
          obj: URLSearchParams;
        };
      };
    };

    mark: {
      HTML_obj: Element;
      url: {
        value: string;
        URLParams: {
          obj: URLSearchParams;
        };
      };
    };
    book_mate: {
      book_name: string;
      book_HTML_obj: Element;
      book_ing_url: string;
    };
  }
  let All_UpData_Url_Data: Type__BookData[] = [];
  let all_updata_label: NodeListOf<Element> =
    document.querySelectorAll(".newbox2 h3 label");
  if (Debug) {
    console.group();
  }
  all_updata_label.forEach((up_data_label) => {
    //#region book_mate
    let book_HTML_obj: Element = up_data_label!.parentNode!.parentNode!
      .parentNode!.parentNode as Element;
    let book_name: string = book_HTML_obj.querySelector("div > h3 > a > span")!
      .innerHTML as string;
    let book_img_url: string = (
      book_HTML_obj.querySelector("a > img") as HTMLImageElement
    ).src;
    //#endregion book_mate

    //#region mark
    let book_mark_HTML_obj: Element = up_data_label
      .parentNode!.parentNode!.parentNode!.querySelectorAll("div")[1]
      .querySelectorAll("p")[0];
    let mark_url = book_mark_HTML_obj.querySelector("a")!.href;
    let mark_url_obj: URLSearchParams = new URLSearchParams(mark_url);
    //#endregion mark

    //#region updata
    let book_updata_HTML_obj: Element = up_data_label
      .parentNode!.parentNode!.parentNode!.querySelectorAll("div")[1]
      .querySelectorAll("p")[1];
    let updata_url = book_updata_HTML_obj.querySelector("a")!.href;
    let updata_url_obj: URLSearchParams = new URLSearchParams(updata_url);
    //#endregion updata

    let UpData_Url_Data: Type__BookData = {
      updata: {
        HTML_obj: book_updata_HTML_obj,
        url: {
          value: updata_url,
          URLParams: {
            obj: updata_url_obj,
          },
        },
      },
      mark: {
        HTML_obj: book_mark_HTML_obj,
        url: {
          value: mark_url,
          URLParams: {
            obj: mark_url_obj,
          },
        },
      },
      book_mate: {
        book_name: book_name,
        book_HTML_obj: book_HTML_obj,
        book_ing_url: book_img_url,
      },
    };
    All_UpData_Url_Data.push(UpData_Url_Data);
    if (Debug) {
      console.debug("Has updata", UpData_Url_Data);
    }
  });
  if (Debug) {
    console.groupEnd();
  }

  GM_registerMenuCommand(
    `${
      all_updata_label.length === 0
        ? "沒有"
        : `有${all_updata_label.length + "個"}`
    }更新`,
    () => {
      All_UpData_Url_Data.forEach((UpData_Url_Data: Type__BookData) => {
        GM_openInTab(UpData_Url_Data.updata.url.value);
      });
    }
  );
}

//#region Menu
setMenu("Debug");
setMenu("AutoAddBookcase");
setMenu("IsEndClose");
setMenu("IsHookAlert");
//#endregion Menu

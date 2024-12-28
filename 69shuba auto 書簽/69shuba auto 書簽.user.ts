/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.4.6.0
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

const Debug: boolean = GM_getValue("Debug", false);
const IsEndClose: boolean = GM_getValue("IsEndClose", true);
const AutoAddBookcase: boolean = GM_getValue("AutoAddBookcase", true);
const IsHookAlert: boolean = GM_getValue("IsHookAlert", true);
const HookAlertBlockade: Array<Array<any>> = GM_getValue("HookAlertBlockade", [
  ["添加成功"],
  ["删除成功!"],
]);

const data = {
  Has_bookinfo: function (): boolean {
    return typeof bookinfo !== "undefined";
  },
  IsBookshelf: function (href: string = window.location.href): boolean {
    let pathname: string = new URL(href).pathname;
    return pathname === "/modules/article/bookcase.php";
  },
  Book: {
    GetAid: function (href: string = window.location.href): string {
      if (data.Has_bookinfo()) {
        return bookinfo.articleid;
      } else {
        return href.split("/")[4];
      }
    },
    GetCid: function (href = window.location.href): string {
      if (data.Has_bookinfo()) {
        return bookinfo.chapterid;
      } else {
        return href.split("/")[5];
      }
    },
    pattern: /^\/(txt|c|r)\/([0-9]|[a-z])+\/([0-9]|[a-z])+(\.html)?$/m,
    /* 
    /c/53475/35619708.html
    /txt/53475/35584194
    /r/mgiysntxtj/glhgfqtytpiatghb.html
    */
    Is: function (href: string = window.location.href): boolean {
      let pathname: string = new URL(href).pathname;
      return this.pattern.test(pathname);
    },
  },
  Info: {
    pattern: /^\/(book|b|article)\/([0-9]|[a-z])+\.htm(l)?$/m,
    Is: function (pathname: string = window.location.pathname): boolean {
      return this.pattern.test(pathname);
    },
  },
  End: {
    Is: function (href: string = window.location.href): boolean {
      if (data.Info.Is()) {
        let searchParams = new URL(href).searchParams;
        return searchParams.get("FromBook") === "true";
      }
      return false;
    },
  },
  GetNextPageUrl: function (): string | undefined {
    let ele = document.querySelector(
      "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
    ) as HTMLAnchorElement | null;
    if (ele && ele.href !== null) {
      return ele.href;
    } else {
      ele = document.querySelector(
        "body > div.mainbox > div > div.page1 > a:nth-child(4)"
      );
      if (ele && ele.href !== null) {
        return ele.href;
      }
    }
  },
  IsNextEnd: function (): boolean {
    if (this.Book.Is()) {
      if (data.End.Is(data.GetNextPageUrl())) {
        // next page is end
        return true;
      }
      if (data.Info.Is(new URL(data.GetNextPageUrl() as string).pathname)) {
        // next page is info
        return true;
      }
    }
    return false;
  },
  IsBiz: function (host = location.host): boolean {
    return host === "69shu.biz";
  },
};

let ele: Array<string> = [];
let run: boolean = false;
if (data.Book.Is()) {
  // #tag is_book
  if (Debug) {
    console.log("book");
  }
  run = true;
  if (IsHookAlert) {
    // #tag hook_alert
    const _alert: Function = alert;
    _unsafeWindow.alert = (...message: any) => {
      let blockade: Array<Array<any>> = HookAlertBlockade;
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
  if (Debug) {
    console.log("addStyle start");
  }
  // #tag addStyle
  let css1 = GM_getResourceText("css1");
  GM_addStyle(css1);

  if (Debug) {
    console.log("addStyle end");
  }
  document.onkeydown = null;
  addEventListener("keydown", function (e) {
    if (!e.repeat) {
      switch (e.key) {
        case "ArrowRight": {
          window.location.href = (
            document.querySelector(
              "body > div.mainbox > div > div.page1 > a:nth-child(4)"
            ) as HTMLAnchorElement | null
          )?.href as string;
          break;
        }
        default: {
          if (Debug) {
            console.table({ e: e, key: e.key });
          }
          break;
        }
      }
    }
  });
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
    if (
      addbookcase.toString() ===
      'function addbookcase(aid, cid) {\r\n\r\n    let data = {bid: aid, cid: cid};\r\n    $.post("https://www.69yuedu.net/modules/article/addbookcase.php", data, function (result) {\r\n        alert(result);\r\n    });\r\n}'
    ) {
      addbookcase(data.Book.GetAid(), data.Book.GetCid());
    } else {
      (document.querySelector("#a_addbookcase") as HTMLElement | null)?.click();
    }
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
  if (data.Has_bookinfo()) {
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
  link.href = `${window.location.origin}/${
    data.IsBiz() ? "b" : "book"
  }/${data.Book.GetAid()}.${data.IsBiz() ? "html" : "htm"}?FormTitle=false`;

  // 將 <a> 元素插入到 title 的父元素中
  title?.parentNode?.replaceChild(link, title);

  let ele = document.querySelector(
    "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
  ) as HTMLAnchorElement | null;
  if (ele) {
    ele.href += "?FromBook=true";
  } else {
    ele = document.querySelector(
      "body > div.mainbox > div > div.page1 > a:nth-child(4)"
    );
    if (ele) {
      ele.href += "?FromBook=true";
    }
  }
}
if (data.Info.Is()) {
  // #tag is_info
  if (Debug) {
    console.log("info");
  }
  run = true;
}
if (data.End.Is()) {
  // #tag is_end
  if (Debug) {
    console.log("end");
  }
  run = true;
  if (IsEndClose) {
    window.close();
  }
}
if (data.Book.Is() && data.IsNextEnd()) {
  // #tag is_next_end
  if (Debug) {
    console.log("next_is_end");
  }
  run = true;
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
    if (IsEndClose) {
      window.close();
    }
  });
}
if (data.IsBookshelf()) {
  // #tag is_bookshelf
  if (Debug) {
    console.log("bookshelf");
  }
  run = true;

  interface BookData {
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
  let All_UpData_Url_Data: Array<BookData> = [];
  let all_updata_label = document.querySelectorAll(".newbox2 h3 label");
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

    let UpData_Url_Data: BookData = {
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
      All_UpData_Url_Data.forEach((UpData_Url_Data: BookData) => {
        GM_openInTab(UpData_Url_Data.updata.url.value);
      });
    }
  );
}
if (!run) {
  console.error("no run", this);
  console.table({
    Is_Book: data.Book.Is(),
    Is_Info: data.Info.Is(),
    Is_End: data.End.Is(),
    IsNextEnd: data.IsNextEnd(),
    IsBookshelf: data.IsBookshelf(),
    Has_bookinfo: data.Has_bookinfo(),
    IsBiz: data.IsBiz(),
    IsEndClose: IsEndClose,
    AutoAddBookcase: AutoAddBookcase,
    IsHookAlert: IsHookAlert,
    HookAlertBlockade: HookAlertBlockade,
    Debug: Debug,
  });
}

//#region Menu
setMenu("Debug");
setMenu("AutoAddBookcase");
setMenu("IsEndClose");
setMenu("IsHookAlert");
//#endregion Menu

"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts" />
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.4.4.0
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
// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @require      https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// #@require      C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
// @license      MIT
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// ==/UserScript==
const Debug = GM_getValue("Debug", false);
const IsEndClose = GM_getValue("IsEndClose", true);
const AutoAddBookcase = GM_getValue("AutoAddBookcase", true);
const IsHookAlert = GM_getValue("IsHookAlert", true);
const HookAlertBlockade = GM_getValue("HookAlertBlockade", [
    ["添加成功"],
    ["删除成功!"],
]);
let data = {
    Has_bookinfo: function () {
        return typeof bookinfo !== "undefined";
    },
    IsBookshelf: function (href = window.location.href) {
        let pathname = new URL(href).pathname;
        return pathname === "/modules/article/bookcase.php";
    },
    Book: {
        GetAid: function (href = window.location.href) {
            if (data.Has_bookinfo()) {
                return bookinfo.articleid;
            }
            else {
                return href.split("/")[4];
            }
        },
        GetCid: function (href = window.location.href) {
            if (data.Has_bookinfo()) {
                return bookinfo.chapterid;
            }
            else {
                return href.split("/")[5];
            }
        },
        pattern: /^\/(txt|c)\/[0-9]+\/[0-9]+(\.html)?$/m,
        // /c/53475/35619708.html
        // /txt/53475/35584194
        Is: function (href = window.location.href) {
            let pathname = new URL(href).pathname;
            return this.pattern.test(pathname);
        },
    },
    Info: {
        pattern: /^\/(book|b)\/[0-9]+\.htm(l)?$/m,
        Is: function (href = window.location.href) {
            let pathname = new URL(href).pathname;
            return this.pattern.test(pathname);
        },
    },
    End: {
        Is: function (href = window.location.href) {
            if (new URL(href).searchParams.get("FormTitle") === "false") {
                if (Debug) {
                    console.log("b#searchParams.end;s#f");
                }
                return false;
            }
            if (new URL(href).searchParams.get("FromBook") === "true") {
                return data.Info.Is(href);
            }
            console.warn("err-2");
            return false;
        },
    },
    GetNextPageUrl: function () {
        let ele = document.querySelector("body > div.container > div.mybox > div.page1 > a:nth-child(4)");
        if (ele) {
            if (ele.href !== null) {
                return ele.href;
            }
        }
    },
    IsNextEnd: function () {
        if (data.End.Is(data.GetNextPageUrl())) {
            return true;
        }
        if (data.IsBookshelf(data.GetNextPageUrl())) {
            return false;
        }
        if (data.Book.Is(data.GetNextPageUrl())) {
            return false;
        }
        if (Debug) {
            console.warn("err-1");
        }
        return false;
    },
};
let ele = [];
if (data.Book.Is()) {
    // #tag is_book
    if (IsHookAlert) {
        // #tag hook_alert
        const _alert = alert;
        _unsafeWindow.alert = (...message) => {
            let blockade = HookAlertBlockade;
            let r = false;
            let n = 0;
            blockade.forEach((blockade_ele) => {
                n++;
                if (JSON.stringify(message) === JSON.stringify(blockade_ele) ||
                    JSON.stringify(blockade_ele) === "*") {
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
    remove_ele(".mytitle", ".top_Scroll", "#pagefootermenu", "body > div.container > div > div.yueduad1", "#pageheadermenu", ".bottom-ad2", "body > div.container > div.yuedutuijian.light");
    if (AutoAddBookcase) {
        document.querySelector("#a_addbookcase")?.click();
    }
    else if (Debug) {
        console.log("auto_bookcase !== true");
    }
    let author = "undefined";
    if ((typeof bookinfo === "undefined" || bookinfo) ?? false) {
        author =
            document
                .querySelector("body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)")
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
    let title = document.querySelector("body > div.container > div.mybox > div.tools");
    // 創建新的 <a> 元素
    let link = document.createElement("a");
    // 設置 <a> 元素的內容為 bookinfo.articlename
    if ((typeof bookinfo != "undefined" && bookinfo) ?? false) {
        if (Debug) {
            console.log("user bookinfo.articlename");
        }
        link.innerHTML =
            bookinfo.articlename ??
                document.querySelector("head > title").innerHTML.split("-")[0];
    }
    else {
        if (Debug) {
            console.log("from head>title get title");
        }
        link.innerHTML = document
            .querySelector("head > title")
            .innerHTML.split("-")[0];
    }
    // 添加 <a> 元素的類名為 "userjs_add"
    link.classList.add("userjs_add");
    // 設置 <a> 元素的 id 為 "title"
    link.id = "title";
    // 設置 <a> 元素的 href
    link.href = `${window.location.origin}/book/${data.Book.GetAid()}.htm?FormTitle=false`;
    // 將 <a> 元素插入到 title 的父元素中
    title?.parentNode?.replaceChild(link, title);
    let ele = document.querySelector("body > div.container > div.mybox > div.page1 > a:nth-child(4)");
    ele.href += "?FromBook=true";
}
if (data.Info.Is()) {
    // #tag is_info
    if (Debug) {
        console.log("info");
    }
}
if (data.End.Is()) {
    // #tag is_end
    if (Debug) {
        console.log("end");
    }
    if (IsEndClose) {
        window.close();
    }
}
if (data.Book.Is()) {
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
        document.querySelector("body > div.container > div.mybox > div.page1 > a:nth-child(4)")?.addEventListener("click", function () {
            if (Debug) {
                console.log("click");
            }
            if (AutoAddBookcase) {
                document.querySelector("#a_addbookcase")?.click();
            }
            else if (Debug) {
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
    (function () {
        // bug: Decoder
        let qValue = new URL(location.href).searchParams.get("q");
        if (qValue !== null) {
            new URL(location.href).searchParams.has;
            let ele = document.querySelector("body > header > div > form > div > div > input[type=text]:nth-child(2)");
            ele.value = qValue;
            const encoder = new TextEncoder(); // 用於編碼字符串
            const decoder = new TextDecoder("gbk"); // 用於解碼 GBK 編碼的內容
            // 假設的搜索值
            const searchValue = qValue;
            const searchtype = "all";
            const requestData = new URLSearchParams({
                searchkey: searchValue,
                searchtype: searchtype,
            }).toString(); // 將數據轉換為 URL 查詢字串
            // 將請求數據轉換為 ArrayBuffer
            const encodedData = encoder.encode(requestData); // 使用 TextEncoder 進行編碼
            // 發送請求
            fetch("https://69shuba.cx/modules/article/search.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: encodedData, // 將編碼後的數據作為請求體
            })
                .then((response) => {
                if (!response.ok) {
                    throw new Error("網絡響應不是 OK");
                }
                // 將響應轉換為 ArrayBuffer
                return response.arrayBuffer();
            })
                .then((buffer) => {
                // 使用 TextDecoder 進行解碼
                let html = decoder.decode(buffer);
                // html.replaceAll('<meta charset="gbk">', '<meta charset="utf-8">');
                // const newWindow = window.open() as Window; // 開啟新窗口
                const newWindow = window;
                newWindow.document.open(); // 打開文檔流
                newWindow.document.write(html); // 寫入返回的 HTML
                newWindow.document.close(); // 關閉文檔流
            })
                .catch((error) => {
                console.error("發生錯誤:", error);
            });
            // window.close();
        }
    });
    let All_UpData_Url_Data = [];
    let all_updata_label = document.querySelectorAll(".newbox2 h3 label");
    if (Debug) {
        console.group();
    }
    all_updata_label.forEach((up_data_label) => {
        //#region book_mate
        let book_HTML_obj = up_data_label.parentNode.parentNode
            .parentNode.parentNode;
        let book_name = book_HTML_obj.querySelector("div > h3 > a > span")
            .innerHTML;
        let book_img_url = book_HTML_obj.querySelector("a > img").src;
        //#endregion book_mate
        //#region mark
        let book_mark_HTML_obj = up_data_label
            .parentNode.parentNode.parentNode.querySelectorAll("div")[1]
            .querySelectorAll("p")[0];
        let mark_url = book_mark_HTML_obj.querySelector("a").href;
        let mark_url_obj = new URLSearchParams(mark_url);
        //#endregion mark
        //#region updata
        let book_updata_HTML_obj = up_data_label
            .parentNode.parentNode.parentNode.querySelectorAll("div")[1]
            .querySelectorAll("p")[1];
        let updata_url = book_updata_HTML_obj.querySelector("a").href;
        let updata_url_obj = new URLSearchParams(updata_url);
        //#endregion updata
        let UpData_Url_Data = {
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
    GM_registerMenuCommand(`${all_updata_label.length === 0
        ? "沒有"
        : `有${all_updata_label.length + "個"}`}更新`, () => {
        All_UpData_Url_Data.forEach((UpData_Url_Data) => {
            GM_openInTab(UpData_Url_Data.updata.url.value);
        });
    });
}
//#region Menu
setMenu("Debug");
setMenu("AutoAddBookcase");
setMenu("IsEndClose");
setMenu("IsHookAlert");
//#endregion Menu
//# sourceMappingURL=69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js.map
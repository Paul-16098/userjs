"use strict";
// ==UserScript==
// @name         ixdzs8.tw
// @namespace    pl816098
// @version      1.2.9.2
// @description  自用
// @author       paul
// @match        https://ixdzs8.com/read/*/*.html
// @match        https://ixdzs8.com/read/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixdzs8.tw
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        window.close
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/ixdzs8tw/ixdzs8tw.user.css
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL  https://github.com/Paul-16098/vs_code/raw/main/js/userjs/ixdzs8tw.user.js
// @updateURL    https://github.com/Paul-16098/vs_code/raw/main/js/userjs/ixdzs8tw.user.js
// ==/UserScript==
let ele = [];
let url = window.location.href;
let next_page_url = document.querySelector("body > div.page-d.page-turn > div > a.chapter-paging.chapter-next").href;
let pattern = {
    book: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/(?!end)p[0-9]*\.html)$/gm,
        is: (url) => {
            if (pattern.book.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    info: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/)$/gm,
        is: (url) => {
            if (pattern.info.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    end: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/end\.html)$/gm,
        is: (url) => {
            if (pattern.end.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
};
if (pattern.book.is(url)) {
    ele = [
        "#page-id3",
        "#page-toolbar",
        "#page > article > section > p:nth-child(1)",
    ];
    ele.forEach((ele) => {
        if (document.querySelector(ele)) {
            document.querySelector(ele).remove();
        }
    });
    GM_addStyle(GM_getResourceText("css1"));
}
if (pattern.end.is(url) || pattern.end.is(next_page_url)) {
    // console.log("end")
    if (pattern.end.is(next_page_url)) {
        document.addEventListener("keydown", function (e) {
            if (!e.repeat) {
                switch (true) {
                    case e.key === "ArrowRight": {
                        // console.log('(e.key === "ArrowRight") === true');
                        window.close();
                        break;
                    }
                    default: {
                        // console.log("e: ", e);
                        break;
                    }
                }
            }
        });
    }
    if (pattern.end.is(url)) {
        window.close();
    }
}
if (pattern.info.is(url)) {
    document.querySelector("#intro").click();
}
//# sourceMappingURL=ixdzs8tw.user.js.map
// ==UserScript==
// @name         ixdzs8.tw
// @namespace    pl816098
// @version      1.2.9.2
// @description  自用
// @author       paul
// @match        https://ixdzs8.com/read/*/*.html
// @match        https://ixdzs8.com/read/*/
// @match        https://ixdzs.hk/read/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixdzs8.tw
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        window.close
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/ixdzs8tw/ixdzs8tw.user.css
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// ==/UserScript==

let ele = [];
// let url = globalThis.location.href;

let next_page_url = (
  document.querySelector(
    "body > div.page-d.page-turn > div > a.chapter-paging.chapter-next",
  ) as HTMLAnchorElement
).href;

let pattern = {
  book: {
    pattern: /^\/read\/\d+\/(?!end)p\d*\.html$/gm,
    is: (url: string = location.pathname) => {
      return pattern.book.pattern.test(url);
    },
  },
  info: {
    pattern: /^\/read\/\d+\/$/gm,
    is: (url: string = location.pathname) => {
      return pattern.info.pattern.test(url);
    },
  },
  end: {
    pattern: /^\/read\/\d+\/end\.html$/gm,
    is: (url: string = location.pathname) => {
      return pattern.end.pattern.test(url);
    },
  },
};

if (pattern.book.is()) {
  ele = [
    "#page-id3",
    "#page-toolbar",
    "#page > article > section > p:nth-child(1)",
  ];
  ele.forEach((ele) => {
    if (document.querySelector(ele)) {
      document.querySelector(ele)!.remove();
    }
  });
  GM_addStyle(GM_getResourceText("css1"));
}
if (pattern.end.is() || pattern.end.is(new URL(next_page_url).pathname)) {
  // console.log("end")
  if (pattern.end.is(next_page_url)) {
    document.addEventListener("keydown", function (e) {
      if (!e.repeat) {
        switch (true) {
          case e.key === "ArrowRight": {
            window.close();
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }
  if (pattern.end.is()) {
    window.close();
  }
}
if (pattern.info.is()) {
  (document.querySelector("#intro") as HTMLElement).click();
}

/// <reference path = "./../Tools/Tools.user.d.ts"/>
// ==UserScript==
// @name         czbooks.net
// @namespace    pl816098
// @version      1.1.6.2
// @description  自用
// @author       pl816098
// @match        https://czbooks.net/n/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=czbooks.net
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// #@require      file:///C:/Users/p/Documents/git/vs_code/js/userjs/Tools/Tools.user.js
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL  https://github.com/Paul-16098/vs_code/raw/main/js/userjs/czbooksnet.user.js
// @updateURL    https://github.com/Paul-16098/vs_code/raw/main/js/userjs/czbooksnet.user.js
// ==/UserScript==

GM_addStyle(`
      .chapter-detail,
      .content {
        line-height: normal;
      }
      #sticky-parent {
        width: auto;
      }
      #sticky-parent > .chapter-detail {
        width: auto;
      }
      .content {
        font-size: 17px;
      }
      
      `);
remove_ele(
  "body > div.header",
  "body > div.footer",
  "body > div.main > div:nth-child(3)",
  "#go-to-top",
  "#sticky-parent > div.chapter-detail > div.notice"
);

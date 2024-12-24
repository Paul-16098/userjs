"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts"/>
// ==UserScript==
// @name         czbooks.net
// @namespace    pl816098
// @version      1.1.8.0
// @description  自用
// @author       pl816098
// @match        https://czbooks.net/n/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=czbooks.net
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @license      MIT
// @require      https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// #@require      file:///C:/Users/p/Documents/git/userjs/Tools/Tools.user.js
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/czbooksnet/czbooksnet.css
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/
// ==/UserScript==
let css1 = GM_getResourceText("css1");
GM_addStyle(css1);
remove_ele("body > div.header", "body > div.footer", "body > div.main > div:nth-child(3)", "#go-to-top", "#sticky-parent > div.chapter-detail > div.notice");
//# sourceMappingURL=czbooksnet.user.js.map
// ==UserScript==
// @name         czbooks.net
// @namespace    pl816098
// @version      1.1.11.0
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
//#if debug
// #@require file://C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/czbooksnet/czbooksnet.css
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/
// ==/UserScript==
"use strict";(()=>{var c=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports);var o=c(()=>{var d=GM_getResourceText("css1");GM_addStyle(d);removeElement("body > div.header","body > div.footer","body > div.main > div:nth-child(3)","#go-to-top","#sticky-parent > div.chapter-detail > div.notice");var a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;(!e||typeof e!="function")&&(e=function(t){switch(t){case"default":{document.querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(2) > a")?.click();break}case"white":{document.querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(3) > a")?.click();break}}});var e;e(a?"default":"white");window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",i=>{i.matches?e("default"):e("white")})});o();})();
//# sourceMappingURL=czbooksnet.user.js.map

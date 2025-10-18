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
"use strict";(()=>{var o=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports);var i=o(()=>{var r=[],c=window.location.href,a=document.querySelector("body > div.page-d.page-turn > div > a.chapter-paging.chapter-next").href,t={book:{pattern:/^\/read\/[0-9]+\/(?!end)p[0-9]*\.html$/gm,is:(e=location.pathname)=>t.book.pattern.test(e)},info:{pattern:/^\/read\/[0-9]+\/$/gm,is:(e=location.pathname)=>t.info.pattern.test(e)},end:{pattern:/^\/read\/[0-9]+\/end\.html$/gm,is:(e=location.pathname)=>t.end.pattern.test(e)}};t.book.is()&&(r=["#page-id3","#page-toolbar","#page > article > section > p:nth-child(1)"],r.forEach(e=>{document.querySelector(e)&&document.querySelector(e).remove()}),GM_addStyle(GM_getResourceText("css1")));(t.end.is()||t.end.is(new URL(a).pathname))&&(t.end.is(a)&&document.addEventListener("keydown",function(e){if(!e.repeat)switch(!0){case e.key==="ArrowRight":{window.close();break}default:break}}),t.end.is()&&window.close());t.info.is()&&document.querySelector("#intro").click()});i();})();
//# sourceMappingURL=ixdzs8tw.user.js.map

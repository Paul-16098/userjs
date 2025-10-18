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
"use strict";(()=>{var __getOwnPropNames=Object.getOwnPropertyNames;var __commonJS=(cb,mod)=>function(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports};var require_ixdzs8tw_user=__commonJS({"ixdzs8tw/ixdzs8tw.user.ts"(){var ele=[],url=window.location.href,next_page_url=document.querySelector("body > div.page-d.page-turn > div > a.chapter-paging.chapter-next").href,pattern={book:{pattern:/^\/read\/[0-9]+\/(?!end)p[0-9]*\.html$/gm,is:(url2=location.pathname)=>pattern.book.pattern.test(url2)},info:{pattern:/^\/read\/[0-9]+\/$/gm,is:(url2=location.pathname)=>pattern.info.pattern.test(url2)},end:{pattern:/^\/read\/[0-9]+\/end\.html$/gm,is:(url2=location.pathname)=>pattern.end.pattern.test(url2)}};pattern.book.is()&&(ele=["#page-id3","#page-toolbar","#page > article > section > p:nth-child(1)"],ele.forEach(ele2=>{document.querySelector(ele2)&&document.querySelector(ele2).remove()}),GM_addStyle(GM_getResourceText("css1")));(pattern.end.is()||pattern.end.is(new URL(next_page_url).pathname))&&(pattern.end.is(next_page_url)&&document.addEventListener("keydown",function(e){if(!e.repeat)switch(!0){case e.key==="ArrowRight":{window.close();break}default:break}}),pattern.end.is()&&window.close());pattern.info.is()&&document.querySelector("#intro").click()}});require_ixdzs8tw_user();})();
//# sourceMappingURL=ixdzs8tw.user.js.map

"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts"/>
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
// @require      https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
// #@require      file:///C:/Users/p/Documents/git/userjs/Tools/Tools.user.js
// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/czbooksnet/czbooksnet.css
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/
// ==/UserScript==
/**
 * 取得並注入自定義CSS樣式
 */
let css1 = GM_getResourceText("css1");
GM_addStyle(css1);
/**
 * 移除頁面不需要的元素，提升閱讀體驗
 */
removeElement("body > div.header", "body > div.footer", "body > div.main > div:nth-child(3)", "#go-to-top", "#sticky-parent > div.chapter-detail > div.notice");
/**
 * 判斷是否為深色模式
 * @type {boolean}
 */
const isDarkMode = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
/**
 * 切換背景主題（預設/白色）
 * @param params - "default" 為深色，"white" 為淺色
 */
if (!changeBackground || typeof changeBackground !== "function") {
    function changeBackground(params) {
        switch (params) {
            case "default": {
                // 點擊預設主題按鈕
                document.querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(2) > a").click();
                break;
            }
            case "white": {
                // 點擊白色主題按鈕
                document.querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(3) > a").click();
                break;
            }
        }
    }
}
// 根據系統主題自動切換背景
if (isDarkMode) {
    changeBackground("default");
}
else {
    changeBackground("white");
}
/**
 * 監聽系統主題變化，自動切換背景
 */
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
    if (e.matches) {
        changeBackground("default");
    }
    else {
        changeBackground("white");
    }
});
//# sourceMappingURL=czbooksnet.user.js.map
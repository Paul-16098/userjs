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
//#if debug
// #@require file://C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif
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
 */
const isDarkMode = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches;
/**
 * 切換背景主題（預設/白色）
 * @param params - "default" 為深色，"white" 為淺色
 */
function changeBackground(params) {
    switch (params) {
        case "default": {
            // 點擊預設主題按鈕
            document
                .querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(2) > a")
                ?.click();
            break;
        }
        case "white": {
            // 點擊白色主題按鈕
            document
                .querySelector("#sticky-parent > div.chapter-detail > div.customs-function > ul:nth-child(2) > li:nth-child(3) > a")
                ?.click();
            break;
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
globalThis
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
    if (e.matches) {
        changeBackground("default");
    }
    else {
        changeBackground("white");
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3pib29rc25ldC51c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3pib29rc25ldC51c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvREFBb0Q7QUFDcEQsaUJBQWlCO0FBQ2pCLDRCQUE0QjtBQUM1Qix5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLG1CQUFtQjtBQUNuQix5QkFBeUI7QUFDekIsMENBQTBDO0FBQzFDLDRFQUE0RTtBQUM1RSw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1Qix1Q0FBdUM7QUFDdkMsbUNBQW1DO0FBQ25DLG9CQUFvQjtBQUNwQixXQUFXO0FBQ1gsdUVBQXVFO0FBQ3ZFLE9BQU87QUFDUCw0RUFBNEU7QUFDNUUsUUFBUTtBQUNSLHVHQUF1RztBQUN2Ryw2REFBNkQ7QUFDN0Qsc0RBQXNEO0FBQ3RELGtCQUFrQjtBQUNsQjs7R0FFRztBQUNILElBQUksSUFBSSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsQjs7R0FFRztBQUNILGFBQWEsQ0FDWCxtQkFBbUIsRUFDbkIsbUJBQW1CLEVBQ25CLG9DQUFvQyxFQUNwQyxZQUFZLEVBQ1osa0RBQWtELENBQ25ELENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FDeEMsOEJBQThCLENBQy9CLENBQUMsT0FBTyxDQUFDO0FBRVY7OztHQUdHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxNQUEyQjtJQUNuRCxRQUFRLE1BQU0sRUFBRSxDQUFDO1FBQ2YsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsV0FBVztZQUNYLFFBQVE7aUJBQ0wsYUFBYSxDQUNaLG9HQUFvRyxDQUNyRztnQkFDRCxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ1osTUFBTTtRQUNSLENBQUM7UUFDRCxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixXQUFXO1lBQ1gsUUFBUTtpQkFDTCxhQUFhLENBQ1osb0dBQW9HLENBQ3JHO2dCQUNELEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDWixNQUFNO1FBQ1IsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZTtBQUNmLElBQUksVUFBVSxFQUFFLENBQUM7SUFDZixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QixDQUFDO0tBQU0sQ0FBQztJQUNOLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFFRDs7R0FFRztBQUNILFVBQVU7S0FDUCxVQUFVLENBQUMsOEJBQThCLENBQUM7S0FDMUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDaEMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZCxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDO1NBQU0sQ0FBQztRQUNOLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9
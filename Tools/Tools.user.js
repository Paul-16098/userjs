// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.14.0
// @match        *://*/*
// @author       paul
// @license      MIT
// @grant        GM_getValue
// @run-at       document-start
// @grant        unsafeWindow
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL  https://github.com/Paul-16098/vs_code/raw/main/js/userjs/Tools.user.js
// @updateURL    https://github.com/Paul-16098/vs_code/raw/main/js/userjs/Tools.user.js
// ==/UserScript==
"use strict";(()=>{var y=unsafeWindow??globalThis??window,g=GM_getValue("IS_DEBUG_LOG",!1);function h(...n){try{n&&n.forEach(t=>{g&&(console.log("args: ",t),console.log("document.querySelectorAll(args): ",document.querySelectorAll(t))),document.querySelectorAll(t).length!==0?document.querySelectorAll(t).forEach(e=>{e.remove()}):console.debug(t,"is not a Html Element.")})}catch(t){return console.error(t),[!1,n,t]}return[!0,n]}function d(n,t,e,i){let r={true:"\u958B",false:"\u95DC",...i},s=!1,l=r[n]??n.replaceAll("_"," "),o=GM_getValue(n),u="No support";o===void 0&&e!==void 0&&(GM_setValue(n,e),o=e,console.debug(`setMenu: ${n} set default value: ${e}`)),typeof o=="boolean"&&(s=!0,u=o.toString()),u=r[o]??u;let f=t??(s?function(a){typeof o=="boolean"&&(GM_setValue(n,!o),globalThis.location.reload())}:()=>{let a="the type is not supported: "+typeof o;console.error(a)});return GM_registerMenuCommand(`${l}: ${u}`,f)}var p=["eval","function","let","var","document","alert","navigator","localStorage","sessionStorage","console","XMLHttpRequest","fetch","import","export","async","await","with","Promise",/window\.[\da-zA-Z_]+ *=/];function w(n,t=!0){if(t){for(let e of p)if(typeof e=="string"){if(n.includes(e))throw new Error(`\u4E0D\u5141\u8A31\u7684\u95DC\u9375\u5B57\u6216\u4EE3\u78BC: ${JSON.stringify(e)},\u5728\u4EE3\u78BC: ${n}`)}else if(e instanceof RegExp&&e.test(n))throw new Error(`\u4E0D\u5141\u8A31\u7684\u95DC\u9375\u5B57\u6216\u4EE3\u78BC: ${e},\u5728\u4EE3\u78BC: ${n}`)}return new Function(`${t?"return":""} ${n}`)()}var c=class{langJson;langList=[];constructor(t,e){if(this.langJson=t,Array.isArray(e))this.langList.push(...e);else if(typeof e=="string")this.langList.push(e);else throw new TypeError("i18n:constructor:parameter:lang: not allow type")}get(t,...e){for(let i of this?.langList)if(this.langJson[i]?.[t]){let r=this.langJson[i][t];return e&&e.length>0&&(r=r.replace(/{(\d+)}/g,(s,l)=>l>=0&&l<e.length?typeof e[l]>"u"?s:e[l]:s)),r}return console.warn(`Translation missing for key: "${t}"`),String(t)}t=this.get};})();
//# sourceMappingURL=Tools.user.js.map

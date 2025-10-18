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
"use strict";(()=>{var _unsafeWindow=unsafeWindow??globalThis??window,IS_DEBUG_LOG=GM_getValue("IS_DEBUG_LOG",!1);function removeElement(...args){try{args&&args.forEach(args2=>{IS_DEBUG_LOG&&(console.log("args: ",args2),console.log("document.querySelectorAll(args): ",document.querySelectorAll(args2))),document.querySelectorAll(args2).length!==0?document.querySelectorAll(args2).forEach(ele=>{ele.remove()}):console.debug(args2,"is not a Html Element.")})}catch(e){return console.error(e),[!1,args,e]}return[!0,args]}function setMenu(name,fn,def,showMapping){let trueShowMapping={true:"\u958B",false:"\u95DC",...showMapping},support=!1,showName=trueShowMapping[name]??name.replaceAll("_"," "),getValue=GM_getValue(name),showValue="No support";getValue===void 0&&def!==void 0&&(GM_setValue(name,def),getValue=def,console.debug(`setMenu: ${name} set default value: ${def}`)),typeof getValue=="boolean"&&(support=!0,showValue=getValue.toString()),showValue=trueShowMapping[getValue]??showValue;let trueFn=fn??(support?function(ev){typeof getValue=="boolean"&&(GM_setValue(name,!getValue),globalThis.location.reload())}:()=>{let t="the type is not supported: "+typeof getValue;console.error(t)});return GM_registerMenuCommand(`${showName}: ${showValue}`,trueFn)}var blackList=["eval","function","let","var","document","alert","navigator","localStorage","sessionStorage","console","XMLHttpRequest","fetch","import","export","async","await","with","Promise",/window\.[\da-zA-Z_]+ *=/];function newEval(stringCode,safety=!0){if(safety){for(let value of blackList)if(typeof value=="string"){if(stringCode.includes(value))throw new Error(`\u4E0D\u5141\u8A31\u7684\u95DC\u9375\u5B57\u6216\u4EE3\u78BC: ${JSON.stringify(value)},\u5728\u4EE3\u78BC: ${stringCode}`)}else if(value instanceof RegExp&&value.test(stringCode))throw new Error(`\u4E0D\u5141\u8A31\u7684\u95DC\u9375\u5B57\u6216\u4EE3\u78BC: ${value},\u5728\u4EE3\u78BC: ${stringCode}`)}return new Function(`${safety?"return":""} ${stringCode}`)()}var I18n=class{langJson;langList=[];constructor(langJson,lang){if(this.langJson=langJson,Array.isArray(lang))this.langList.push(...lang);else if(typeof lang=="string")this.langList.push(lang);else throw new TypeError("i18n:constructor:parameter:lang: not allow type")}get(key,...args){for(let lang of this?.langList)if(this.langJson[lang]?.[key]){let text=this.langJson[lang][key];return args&&args.length>0&&(text=text.replace(/{(\d+)}/g,(match,number)=>number>=0&&number<args.length?typeof args[number]>"u"?match:args[number]:match)),text}return console.warn(`Translation missing for key: "${key}"`),String(key)}t=this.get};})();
//# sourceMappingURL=Tools.user.js.map

"use strict";
/// <reference path = "./../Tools/Tools.user.d.ts"/>
// ==UserScript==
// @name         琉璃神社
// @namespace    Paul-16098
// @version      1.0.0.1
// @description  try to take over the world!
// @author       pl816098
// @match        https://www.hacg.mov/wp/sign-in*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hacg.mov
// @grant        none
// @license      MIT
//#if debug
// #@require file://C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @downloadURL  https://github.com/Paul-16098/userjs/raw/refs/heads/dev/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.ts
// @updateURL    https://github.com/Paul-16098/userjs/raw/refs/heads/dev/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.ts
// ==/UserScript==
let q = document
    .evaluate('//*[@id="wpforo-wrap"]/div[3]/div[1]/div/div/div/form/div/div/div/div/div/div[3]/div[1]/div[1]/strong', document, null, XPathResult.STRING_TYPE, null)
    .stringValue.replace("−", "-")
    .replace("×", "*")
    .split("=")[0]
    .trim();
document.querySelector("#wpforo-wrap > div.wpforo-main > div.wpforo-content > div > div > div > form > div > div > div > div > div > div.wpf-field.wpf-field-type-text.wpf-field-hook > div.wpf-field-wrap > div.aiowps-captcha-equation.hide-when-displaying-tfa-input > strong > input.aiowps-captcha-answer").value = newEval(q);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoi55CJ55KD56We56S+LnVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyLnkInnkoPnpZ7npL4udXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0RBQW9EO0FBQ3BELGlCQUFpQjtBQUNqQixxQkFBcUI7QUFDckIsMkJBQTJCO0FBQzNCLHdCQUF3QjtBQUN4Qiw0Q0FBNEM7QUFDNUMseUJBQXlCO0FBQ3pCLGlEQUFpRDtBQUNqRCx5RUFBeUU7QUFDekUscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixXQUFXO0FBQ1gsdUVBQXVFO0FBQ3ZFLE9BQU87QUFDUCw0RUFBNEU7QUFDNUUsUUFBUTtBQUNSLDhEQUE4RDtBQUM5RCxxSkFBcUo7QUFDckoscUpBQXFKO0FBQ3JKLGtCQUFrQjtBQUVsQixJQUFJLENBQUMsR0FBVyxRQUFRO0tBQ3JCLFFBQVEsQ0FDUCx1R0FBdUcsRUFDdkcsUUFBUSxFQUNSLElBQUksRUFDSixXQUFXLENBQUMsV0FBVyxFQUN2QixJQUFJLENBQ0w7S0FDQSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FDN0IsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FDakIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNiLElBQUksRUFBRSxDQUFDO0FBR1IsUUFBUSxDQUFDLGFBQWEsQ0FDcEIsd1JBQXdSLENBRTNSLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyJ9
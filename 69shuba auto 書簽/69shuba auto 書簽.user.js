// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.5.13.0
// @description  自動書籤,更改css,可以在看書頁找到作者連結
// @author       Paul-16098
// #tag 69shux.com
// @match        https://69shux.com/txt/*/*
// @match        https://69shux.com/txt/*/end.html
// @match        https://69shux.com/book/*.htm*
// @match        https://69shux.com/modules/article/bookcase.php*
// #tag www.69shu.top
// @match        https://www.69shu.top/txt/*/*
// @match        https://www.69shu.top/txt/*/end.html
// @match        https://www.69shu.top/book/*.htm*
// @match        https://www.69shu.top/modules/article/bookcase.php*
// #tag www.69shu.cx
// @match        https://www.69shu.cx/txt/*/*
// @match        https://www.69shu.cx/txt/*/end.html
// @match        https://www.69shu.cx/book/*.htm*
// @match        https://www.69shu.cx/modules/article/bookcase.php*
// #tag 69shuba.cx
// @match        https://69shuba.cx/txt/*/*
// @match        https://69shuba.cx/txt/*/end.html
// @match        https://69shuba.cx/book/*.htm*
// @match        https://69shuba.cx/modules/article/bookcase.php*
// #tag www.69shuba.pro
// @match        https://www.69shuba.pro/txt/*/*
// @match        https://www.69shuba.pro/txt/*/end.html
// @match        https://www.69shuba.pro/book/*.htm*
// @match        https://www.69shuba.pro/modules/article/bookcase.php*
// #tag 69shuba.me
// @match        https://69shu.me/txt/*/*
// @match        https://69shu.me/txt/*/end.html
// @match        https://69shu.me/book/*.htm*
// @match        https://69shu.me/modules/article/bookcase.php*
// #tag 69shu.biz
// @match        https://69shu.biz/c/*/*
// @match        https://69shu.biz/c/*/end.html
// @match        https://69shu.biz/b/*.htm*
// @match        https://69shu.biz/modules/article/bookcase.php*
// #tag www.69yuedu.net
// @match        https://www.69yuedu.net/r/*/*.html*
// @match        https://www.69yuedu.net/article/*.html*
// @match        https://www.69yuedu.net/modules/article/bookcase.php*
// #tag www.69shuba.com
// @match        https://www.69shuba.com/txt/*/*
// @match        https://www.69shuba.com/modules/article/bookcase.php*
// @match        https://www.69shuba.com/book/*.htm
// #tag twkan.com
// @match        https://twkan.com/txt/*/*
// @match        https://twkan.com/bookcase*
// @match        https://twkan.com/book/*.html

// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @run-at       document-idle
//#if debug
// #@require file://C:\Users\p\Documents\git\userjs\Tools\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif

// @resource     css1 https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.css
// @resource     replace_json https://github.com/Paul-16098/userjs/raw/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/replace.json
// @license      MIT
// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==
"use strict";(()=>{var m=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var b=m(()=>{var u=(t=>(t.en="en",t.zh="zh",t))(u||{}),h=class{Debug=GM_getValue("Debug",!1);IsEndClose=GM_getValue("IsEndClose",!0);AutoAddBookcase=GM_getValue("AutoAddBookcase",!0);AutoAddBookcaseBlockade=GM_getValue("AutoAddBookcaseBlockade",[]);IsHookAlert=GM_getValue("IsHookAlert",!0);HookAlertBlockade=GM_getValue("HookAlertBlockade",[["\u6DFB\u52A0\u6210\u529F"],["\u522A\u9664\u6210\u529F!"],["\u606D\u559C\u60A8\uFF0C\u8BE5\u7AE0\u8282\u5DF2\u7ECF\u52A0\u5165\u5230\u60A8\u7684\u4E66\u7B7E\uFF01"]]);Language=GM_getValue("Language","zh");constructor(){this.set(),this.registerConfigMenu()}registerConfigMenu(){for(let e in this){let t=this[e],o;Object.values(u).includes(t)&&(o=()=>{Object.values(u).forEach(n=>{n!==t&&(GM_setValue("Language",n),location.reload())})}),setMenu(e,o,t,{zh:"\u4E2D\u6587",en:"english",Debug:"\u5075\u932F",AutoAddBookcase:"\u81EA\u52D5\u6DFB\u52A0\u66F8\u6AC3",AutoAddBookcaseBlockade:"\u81EA\u52D5\u6DFB\u52A0\u66F8\u6AC3\u5C01\u9396",Language:"\u8A9E\u8A00",IsEndClose:"\u7D50\u675F\u5F8C\u95DC\u9589",IsHookAlert:"\u639B\u9264Alert",HookAlertBlockade:"\u639B\u9264Alert\u5C01\u9396"})}}set(){GM_setValue("Debug",this.Debug),GM_setValue("IsEndClose",this.IsEndClose),GM_setValue("AutoAddBookcase",this.AutoAddBookcase),GM_setValue("AutoAddBookcaseBlockade",this.AutoAddBookcaseBlockade),GM_setValue("IsHookAlert",this.IsHookAlert),GM_setValue("HookAlertBlockade",this.HookAlertBlockade),GM_setValue("Language",this.Language)}},a=new h,p={en:{noMatchingPattern:"No matching URL pattern found",errorOccurred:"An error occurred: ",noLabelsFound:"No labels found, retrying in 5 seconds...",maxRetriesReached:"Max retries reached. No labels found.",noUpdates:"No updates",updatesAvailable:" updates available"},zh:{noMatchingPattern:"\u672A\u627E\u5230\u5339\u914D\u7684 URL \u6A21\u5F0F",errorOccurred:"\u767C\u751F\u4E86\u4E00\u4E9B\u932F\u8AA4: ",noLabelsFound:"\u672A\u627E\u5230\u6A19\u7C64\uFF0C5 \u79D2\u5F8C\u91CD\u8A66...",maxRetriesReached:"\u5DF2\u9054\u5230\u6700\u5927\u91CD\u8A66\u6B21\u6578\u3002\u672A\u627E\u5230\u6A19\u7C64\u3002",noUpdates:"\u6C92\u6709\u66F4\u65B0",updatesAvailable:"\u500B\u66F4\u65B0"}},k=class{SELECTORS={nextPage:["body > div.container > div.mybox > div.page1 > a:nth-child(4)","body > div.mainbox > div > div.page1 > a:nth-child(4)"],authorInfo:"body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",titleDiv:"body > div.container > div.mybox > div.tools",searchInput:"body > header > div > form > div > div.inputbox > input[type=text]",searchForm:"body > header > div > form"};data={HasBookInfo:typeof bookinfo<"u",IsBookshelf:(e=location.href)=>this.data.IsTwkan?new URL(e).pathname==="/bookcase":new URL(e).pathname==="/modules/article/bookcase.php",Book:{GetAid:(e=window.location.href)=>this.data.HasBookInfo?bookinfo.articleid:e.split("/")[4],GetCid:(e=window.location.href)=>this.data.HasBookInfo?bookinfo.chapterid:e.split("/")[5],pattern:/^\/(txt|c|r)\/(\d|[a-z])+\/(\d|[a-z])+(\.html)?$/m,Is:(e=window.location.href)=>this.data.Book.pattern.test(new URL(e).pathname)},Info:{pattern:/^\/(book|b|article)\/(\d|[a-z])+\.htm(l)?$/m,Is:(e=window.location.pathname)=>this.data.Info.pattern.test(e)},End:{Is:(e=window.location.href)=>{if(this.data.Info.Is())return new URL(e).searchParams.get("FromBook")==="true";if(this.data.IsTwkan){let t=new URL(e);return!!(/txt\/\d+\/end\.html/.test(t.pathname)&&t.searchParams.get("FromBook")==="true")}return!1}},GetNextPageUrl:()=>this.getNextPageElement()?.href,IsNextEnd:()=>{if(this.data.Book.Is()){let e=this.data.GetNextPageUrl();if(e)return this.data.End.Is(e)||this.data.Info.Is(new URL(e).pathname)}return!1},IsBiz:location.host==="69shu.biz",IsTwkan:location.host==="twkan.com",NotAny:()=>!this.data.Book.Is()&&!this.data.Info.Is()&&!this.data.End.Is()&&!this.data.IsBookshelf()};i18nInstance;t;getNextPageElement(){for(let e of this.SELECTORS.nextPage){let t=document.querySelector(e);if(t?.href)return t}return Array.from(document.querySelectorAll("a")).find(e=>e.textContent==="\u4E0B\u4E00\u7AE0")}constructor(){this.i18nInstance=new I18n(p,a.Language.toString()),this.t=this.i18nInstance.t;try{a.Debug&&console.debug(this.debugInfo());let e=new URLSearchParams(location.search).get("q");if(e&&this.performSearch(e),this.data.End.Is()&&(a.Debug&&console.log("End page detected"),a.IsEndClose&&window.close()),this.data.Book.Is()&&(a.Debug&&console.log("Book page detected"),this.handleBookPage()),this.data.Info.Is()){a.Debug&&console.log("Book info page detected");let t=document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a");t&&t.click()}this.data.IsBookshelf()&&(a.Debug&&console.log("Bookshelf page detected"),this.handleBookshelf()),this.data.NotAny()&&(a.Debug||alert(this.t("noMatchingPattern")))}catch(e){throw a.Debug||alert(`${this.t("errorOccurred")}${String(e)}`),e}}handleBookPage(){if(a.IsHookAlert&&this.hookAlert(),this.addStyles(),this.modifyPageNavigation(),removeElement(".mytitle",".top_Scroll","#pagefootermenu","body > div.container > div > div.yueduad1","#pageheadermenu",".bottom-ad2","body > div.container > div.yuedutuijian.light"),this.data.IsTwkan&&removeElement("#container > br"),a.AutoAddBookcase&&this.autoAddToBookcase(),this.insertAuthorLink(),this.updateNextPageLink(),this.data.IsTwkan){let e=GM_getResourceText("replace_json"),t={};try{t=JSON.parse(e)}catch(o){if(o instanceof SyntaxError)a.Debug?console.log(o):alert(o);else throw o}a.Debug&&console.log("replace_json: ",t);for(let o in t)if(Object.hasOwn(t,o)){let n=t[o];document.querySelector("#txtcontent")&&(document.querySelector("#txtcontent").innerText=document.querySelector("#txtcontent").innerText.replaceAll(o,n))}}}autoAddToBookcase(){let e=this.data.Book.GetAid();a.AutoAddBookcaseBlockade.includes(e)?console.log("Book is in the blockade list, not auto adding to bookcase."):this.addBookcase()}updateNextPageLink(){let e=this.getNextPageElement();if(e){let t=new URL(e.href);t.searchParams.set("FromBook","true"),e.href=t.toString()}}hookAlert(){let e=alert;unsafeWindow.alert=(...t)=>{a.HookAlertBlockade.some(o=>JSON.stringify(t)===JSON.stringify(o)||JSON.stringify(o)==="*")||e(...t),a.Debug&&console.log("Alert message:",t)}}addStyles(){let e=GM_getResourceText("css1");GM_addStyle(e),a.Debug&&console.log("CSS added")}modifyPageNavigation(){document.onkeydown=null,addEventListener("keydown",this.keydownHandler.bind(this))}keydownHandler(e){if(!e.repeat&&e.key==="ArrowRight"){let t=this.data.GetNextPageUrl();if(t){let o=new URL(t);o.searchParams.set("FromBook","true"),window.location.href=o.toString()}this.data.IsNextEnd()&&a.IsEndClose&&window.close()}}addBookcase(){let e=this.data.Book.GetAid(),t=this.data.Book.GetCid();addbookcase.toString().includes("Ajax.Tip")?document.querySelector("#a_addbookcase")?.click():addbookcase(e,t)}insertAuthorLink(){let e;bookinfo?e=bookinfo.author:e=document.querySelector(this.SELECTORS.authorInfo)?.textContent?.trim().split(" ")[1]??"undefined";let t=document.querySelector(this.SELECTORS.titleDiv);if(t){let l=this.createTitleLink();t.parentNode?.replaceChild(l,t)}let o=this.createAuthorLink(e),n=document.querySelector("#container > div.mybox > div > div.txtinfo.hide720 > span:nth-child(2)");if(n===null){console.warn("insertAuthorLink:oal=null");return}document.querySelector("#container > div.mybox > div.txtnav > div.txtinfo.hide720")?.replaceChild(o,n)}createAuthorLink(e){let t=document.createElement("a");return this.data.IsTwkan?t.href=`https://twkan.com/author/${e}.html`:t.href=`${window.location.origin}/modules/article/author.php?author=${encodeURIComponent(e)}`,t.textContent="\u4F5C\u8005\uFF1A "+e,t.style.color="#007ead",t}createTitleLink(){let e=document.createElement("a");return e.innerHTML=this.data.HasBookInfo?bookinfo.articlename??document.title.split("-")[0]:document.title.split("-")[0],e.classList.add("userjs_add"),e.id="title",e.href=`${window.location.origin}/${this.data.IsBiz?"b":"book"}/${this.data.Book.GetAid()}.${this.data.IsBiz||this.data.IsTwkan?"html":"htm"}`,e}async handleBookshelf(){let e=await this.collectBookData();a.Debug&&console.log("Bookshelf data collected",e),this.registerMenuCommand(e)}performSearch(e){let t=document.querySelector(this.SELECTORS.searchInput),o=document.querySelector(this.SELECTORS.searchForm);t&&o&&(t.value=e,o.submit())}async collectBookData(e=0){let t=[],o=document.querySelectorAll("[id^='book_']");return a.Debug&&console.groupCollapsed("collectBookData"),o.length===0?e<=5?(console.warn(this.t("noLabelsFound")),await new Promise(n=>setTimeout(n,5e3)),this.collectBookData(e+1)):(console.error(this.t("maxRetriesReached")),[]):(a.Debug&&console.log(o),o.forEach(n=>{let l=n,f=(function(){if(Array.from(n.querySelectorAll("label")).find(i=>i.textContent==="\u66F4\u65B0")){let d=n.querySelector("div.newright > a.btn.btn-tp").href,c=n.querySelector("div.newnav > h3 > a > span")?.textContent,g=n.querySelector("a > img").src;return{bookContinueLink:d,BookName:c,bookImgUrl:g}}else return!1})();if(f){let{bookContinueLink:i,BookName:d,bookImgUrl:c}=f,s={Updata:{url:{value:i,URLParams:new URLSearchParams(i)}},Mate:{BookName:d,BookHtmlObj:l,BookImgUrl:c}};a.Debug&&(console.group(s.Mate.BookName),console.log(s.Mate),console.table(s.Updata),console.groupEnd()),t.push(s)}}),a.Debug&&console.groupEnd(),t)}registerMenuCommand(e){GM_registerMenuCommand(`${e.length===0?this.t("noUpdates"):`${e.length}${this.t("updatesAvailable")}`}`,()=>{e.forEach(t=>{GM_openInTab(t.Updata.url.value)})})}debugInfo(){return{IsBook:this.data.Book.Is(),IsInfo:this.data.Info.Is(),IsEnd:this.data.End.Is(),IsNextEnd:this.data.IsNextEnd(),IsBookshelf:this.data.IsBookshelf(),HasBookinfo:this.data.HasBookInfo,IsBiz:this.data.IsBiz,IsTwkan:this.data.IsTwkan,...a}}},I=new k});b();})();
//# sourceMappingURL=69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js.map

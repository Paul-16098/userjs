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
"use strict";(()=>{var __getOwnPropNames=Object.getOwnPropertyNames;var __commonJS=(cb,mod)=>function(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports};var require_shuba_auto_user=__commonJS({"69shuba auto \u66F8\u7C3D/69shuba auto \u66F8\u7C3D.user.ts"(){var Language=(Language2=>(Language2.en="en",Language2.zh="zh",Language2))(Language||{}),Config=class{Debug=GM_getValue("Debug",!1);IsEndClose=GM_getValue("IsEndClose",!0);AutoAddBookcase=GM_getValue("AutoAddBookcase",!0);AutoAddBookcaseBlockade=GM_getValue("AutoAddBookcaseBlockade",[]);IsHookAlert=GM_getValue("IsHookAlert",!0);HookAlertBlockade=GM_getValue("HookAlertBlockade",[["\u6DFB\u52A0\u6210\u529F"],["\u522A\u9664\u6210\u529F!"],["\u606D\u559C\u60A8\uFF0C\u8BE5\u7AE0\u8282\u5DF2\u7ECF\u52A0\u5165\u5230\u60A8\u7684\u4E66\u7B7E\uFF01"]]);Language=GM_getValue("Language","zh");constructor(){this.set(),this.registerConfigMenu()}registerConfigMenu(){for(let key in this){let value=this[key],menu;Object.values(Language).includes(value)&&(menu=()=>{Object.values(Language).forEach(lang=>{lang!==value&&(GM_setValue("Language",lang),location.reload())})}),setMenu(key,menu,value,{zh:"\u4E2D\u6587",en:"english",Debug:"\u5075\u932F",AutoAddBookcase:"\u81EA\u52D5\u6DFB\u52A0\u66F8\u6AC3",AutoAddBookcaseBlockade:"\u81EA\u52D5\u6DFB\u52A0\u66F8\u6AC3\u5C01\u9396",Language:"\u8A9E\u8A00",IsEndClose:"\u7D50\u675F\u5F8C\u95DC\u9589",IsHookAlert:"\u639B\u9264Alert",HookAlertBlockade:"\u639B\u9264Alert\u5C01\u9396"})}}set(){GM_setValue("Debug",this.Debug),GM_setValue("IsEndClose",this.IsEndClose),GM_setValue("AutoAddBookcase",this.AutoAddBookcase),GM_setValue("AutoAddBookcaseBlockade",this.AutoAddBookcaseBlockade),GM_setValue("IsHookAlert",this.IsHookAlert),GM_setValue("HookAlertBlockade",this.HookAlertBlockade),GM_setValue("Language",this.Language)}},config=new Config,i18nData={en:{noMatchingPattern:"No matching URL pattern found",errorOccurred:"An error occurred: ",noLabelsFound:"No labels found, retrying in 5 seconds...",maxRetriesReached:"Max retries reached. No labels found.",noUpdates:"No updates",updatesAvailable:" updates available"},zh:{noMatchingPattern:"\u672A\u627E\u5230\u5339\u914D\u7684 URL \u6A21\u5F0F",errorOccurred:"\u767C\u751F\u4E86\u4E00\u4E9B\u932F\u8AA4: ",noLabelsFound:"\u672A\u627E\u5230\u6A19\u7C64\uFF0C5 \u79D2\u5F8C\u91CD\u8A66...",maxRetriesReached:"\u5DF2\u9054\u5230\u6700\u5927\u91CD\u8A66\u6B21\u6578\u3002\u672A\u627E\u5230\u6A19\u7C64\u3002",noUpdates:"\u6C92\u6709\u66F4\u65B0",updatesAvailable:"\u500B\u66F4\u65B0"}},BookManager=class{SELECTORS={nextPage:["body > div.container > div.mybox > div.page1 > a:nth-child(4)","body > div.mainbox > div > div.page1 > a:nth-child(4)"],authorInfo:"body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)",titleDiv:"body > div.container > div.mybox > div.tools",searchInput:"body > header > div > form > div > div.inputbox > input[type=text]",searchForm:"body > header > div > form"};data={HasBookInfo:typeof bookinfo<"u",IsBookshelf:(href=location.href)=>this.data.IsTwkan?new URL(href).pathname==="/bookcase":new URL(href).pathname==="/modules/article/bookcase.php",Book:{GetAid:(href=window.location.href)=>this.data.HasBookInfo?bookinfo.articleid:href.split("/")[4],GetCid:(href=window.location.href)=>this.data.HasBookInfo?bookinfo.chapterid:href.split("/")[5],pattern:/^\/(txt|c|r)\/(\d|[a-z])+\/(\d|[a-z])+(\.html)?$/m,Is:(href=window.location.href)=>this.data.Book.pattern.test(new URL(href).pathname)},Info:{pattern:/^\/(book|b|article)\/(\d|[a-z])+\.htm(l)?$/m,Is:(pathname=window.location.pathname)=>this.data.Info.pattern.test(pathname)},End:{Is:(href=window.location.href)=>{if(this.data.Info.Is())return new URL(href).searchParams.get("FromBook")==="true";if(this.data.IsTwkan){let h=new URL(href);return!!(/txt\/\d+\/end\.html/.test(h.pathname)&&h.searchParams.get("FromBook")==="true")}return!1}},GetNextPageUrl:()=>this.getNextPageElement()?.href,IsNextEnd:()=>{if(this.data.Book.Is()){let nextUrl=this.data.GetNextPageUrl();if(nextUrl)return this.data.End.Is(nextUrl)||this.data.Info.Is(new URL(nextUrl).pathname)}return!1},IsBiz:location.host==="69shu.biz",IsTwkan:location.host==="twkan.com",NotAny:()=>!this.data.Book.Is()&&!this.data.Info.Is()&&!this.data.End.Is()&&!this.data.IsBookshelf()};i18nInstance;t;getNextPageElement(){for(let selector of this.SELECTORS.nextPage){let element=document.querySelector(selector);if(element?.href)return element}return Array.from(document.querySelectorAll("a")).find(link=>link.textContent==="\u4E0B\u4E00\u7AE0")}constructor(){this.i18nInstance=new I18n(i18nData,config.Language.toString()),this.t=this.i18nInstance.t;try{config.Debug&&console.debug(this.debugInfo());let search=new URLSearchParams(location.search).get("q");if(search&&this.performSearch(search),this.data.End.Is()&&(config.Debug&&console.log("End page detected"),config.IsEndClose&&window.close()),this.data.Book.Is()&&(config.Debug&&console.log("Book page detected"),this.handleBookPage()),this.data.Info.Is()){config.Debug&&console.log("Book info page detected");let Ele=document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a");Ele&&Ele.click()}this.data.IsBookshelf()&&(config.Debug&&console.log("Bookshelf page detected"),this.handleBookshelf()),this.data.NotAny()&&(config.Debug||alert(this.t("noMatchingPattern")))}catch(error){throw config.Debug||alert(`${this.t("errorOccurred")}${String(error)}`),error}}handleBookPage(){if(config.IsHookAlert&&this.hookAlert(),this.addStyles(),this.modifyPageNavigation(),removeElement(".mytitle",".top_Scroll","#pagefootermenu","body > div.container > div > div.yueduad1","#pageheadermenu",".bottom-ad2","body > div.container > div.yuedutuijian.light"),this.data.IsTwkan&&removeElement("#container > br"),config.AutoAddBookcase&&this.autoAddToBookcase(),this.insertAuthorLink(),this.updateNextPageLink(),this.data.IsTwkan){let raw_replace_json=GM_getResourceText("replace_json"),replace_json={};try{replace_json=JSON.parse(raw_replace_json)}catch(error){if(error instanceof SyntaxError)config.Debug?console.log(error):alert(error);else throw error}config.Debug&&console.log("replace_json: ",replace_json);for(let key in replace_json)if(Object.hasOwn(replace_json,key)){let element=replace_json[key];document.querySelector("#txtcontent")&&(document.querySelector("#txtcontent").innerText=document.querySelector("#txtcontent").innerText.replaceAll(key,element))}}}autoAddToBookcase(){let aid=this.data.Book.GetAid();config.AutoAddBookcaseBlockade.includes(aid)?console.log("Book is in the blockade list, not auto adding to bookcase."):this.addBookcase()}updateNextPageLink(){let nextPageEle=this.getNextPageElement();if(nextPageEle){let href=new URL(nextPageEle.href);href.searchParams.set("FromBook","true"),nextPageEle.href=href.toString()}}hookAlert(){let _alert=alert;unsafeWindow.alert=(...message)=>{config.HookAlertBlockade.some(blockade=>JSON.stringify(message)===JSON.stringify(blockade)||JSON.stringify(blockade)==="*")||_alert(...message),config.Debug&&console.log("Alert message:",message)}}addStyles(){let css1=GM_getResourceText("css1");GM_addStyle(css1),config.Debug&&console.log("CSS added")}modifyPageNavigation(){document.onkeydown=null,addEventListener("keydown",this.keydownHandler.bind(this))}keydownHandler(e){if(!e.repeat&&e.key==="ArrowRight"){let nextPageLink=this.data.GetNextPageUrl();if(nextPageLink){let href=new URL(nextPageLink);href.searchParams.set("FromBook","true"),window.location.href=href.toString()}this.data.IsNextEnd()&&config.IsEndClose&&window.close()}}addBookcase(){let aid=this.data.Book.GetAid(),cid=this.data.Book.GetCid();addbookcase.toString().includes("Ajax.Tip")?document.querySelector("#a_addbookcase")?.click():addbookcase(aid,cid)}insertAuthorLink(){let author;bookinfo?author=bookinfo.author:author=document.querySelector(this.SELECTORS.authorInfo)?.textContent?.trim().split(" ")[1]??"undefined";let titleDiv=document.querySelector(this.SELECTORS.titleDiv);if(titleDiv){let titleLink=this.createTitleLink();titleDiv.parentNode?.replaceChild(titleLink,titleDiv)}let authorLink=this.createAuthorLink(author),oal=document.querySelector("#container > div.mybox > div > div.txtinfo.hide720 > span:nth-child(2)");if(oal===null){console.warn("insertAuthorLink:oal=null");return}document.querySelector("#container > div.mybox > div.txtnav > div.txtinfo.hide720")?.replaceChild(authorLink,oal)}createAuthorLink(author){let authorLink=document.createElement("a");return this.data.IsTwkan?authorLink.href=`https://twkan.com/author/${author}.html`:authorLink.href=`${window.location.origin}/modules/article/author.php?author=${encodeURIComponent(author)}`,authorLink.textContent="\u4F5C\u8005\uFF1A "+author,authorLink.style.color="#007ead",authorLink}createTitleLink(){let titleLink=document.createElement("a");return titleLink.innerHTML=this.data.HasBookInfo?bookinfo.articlename??document.title.split("-")[0]:document.title.split("-")[0],titleLink.classList.add("userjs_add"),titleLink.id="title",titleLink.href=`${window.location.origin}/${this.data.IsBiz?"b":"book"}/${this.data.Book.GetAid()}.${this.data.IsBiz||this.data.IsTwkan?"html":"htm"}`,titleLink}async handleBookshelf(){let bookData=await this.collectBookData();config.Debug&&console.log("Bookshelf data collected",bookData),this.registerMenuCommand(bookData)}performSearch(search){let searchInput=document.querySelector(this.SELECTORS.searchInput),searchForm=document.querySelector(this.SELECTORS.searchForm);searchInput&&searchForm&&(searchInput.value=search,searchForm.submit())}async collectBookData(retryCount=0){let books=[],labels=document.querySelectorAll("[id^='book_']");return config.Debug&&console.groupCollapsed("collectBookData"),labels.length===0?retryCount<=5?(console.warn(this.t("noLabelsFound")),await new Promise(resolve=>setTimeout(resolve,5e3)),this.collectBookData(retryCount+1)):(console.error(this.t("maxRetriesReached")),[]):(config.Debug&&console.log(labels),labels.forEach(label=>{let bookContainer=label,tmp=(function(){if(Array.from(label.querySelectorAll("label")).find(label2=>label2.textContent==="\u66F4\u65B0")){let bookContinueLink=label.querySelector("div.newright > a.btn.btn-tp").href,BookName=label.querySelector("div.newnav > h3 > a > span")?.textContent,bookImgUrl=label.querySelector("a > img").src;return{bookContinueLink,BookName,bookImgUrl}}else return!1})();if(tmp){let{bookContinueLink,BookName,bookImgUrl}=tmp,push_data={Updata:{url:{value:bookContinueLink,URLParams:new URLSearchParams(bookContinueLink)}},Mate:{BookName,BookHtmlObj:bookContainer,BookImgUrl:bookImgUrl}};config.Debug&&(console.group(push_data.Mate.BookName),console.log(push_data.Mate),console.table(push_data.Updata),console.groupEnd()),books.push(push_data)}}),config.Debug&&console.groupEnd(),books)}registerMenuCommand(bookData){GM_registerMenuCommand(`${bookData.length===0?this.t("noUpdates"):`${bookData.length}${this.t("updatesAvailable")}`}`,()=>{bookData.forEach(data=>{GM_openInTab(data.Updata.url.value)})})}debugInfo(){return{IsBook:this.data.Book.Is(),IsInfo:this.data.Info.Is(),IsEnd:this.data.End.Is(),IsNextEnd:this.data.IsNextEnd(),IsBookshelf:this.data.IsBookshelf(),HasBookinfo:this.data.HasBookInfo,IsBiz:this.data.IsBiz,IsTwkan:this.data.IsTwkan,...config}}},bookManager=new BookManager}});require_shuba_auto_user();})();
//# sourceMappingURL=69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js.map

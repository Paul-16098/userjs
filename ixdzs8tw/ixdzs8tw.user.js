// @license      MIT
"use strict";let ele=[];let url=window.location.href;let next_page_url=document.querySelector("body > div.page-d.page-turn > div > a.chapter-paging.chapter-next").href;let pattern={book:{pattern:/^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/(?!end)p[0-9]*\.html)$/gm,is:url=>{if(pattern.book.pattern.test(url)){return true}else{return false}}},info:{pattern:/^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/)$/gm,is:url=>{if(pattern.info.pattern.test(url)){return true}else{return false}}},end:{pattern:/^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/end\.html)$/gm,is:url=>{if(pattern.end.pattern.test(url)){return true}else{return false}}}};if(pattern.book.is(url)){ele=["#page-id3","#page-toolbar","#page > article > section > p:nth-child(1)"];ele.forEach(ele=>{if(document.querySelector(ele)){document.querySelector(ele).remove()}});GM_addStyle(`
    .page-content{
max-width: none;
padding: 10px 15px;
transform: translateX(0px);
background: #ffffff!important;
}
`)}if(pattern.end.is(url)||pattern.end.is(next_page_url)){if(pattern.end.is(next_page_url)){document.addEventListener("keydown",function(e){if(!e.repeat){switch(true){case e.key==="ArrowRight":{window.close();break}default:{break}}}})}if(pattern.end.is(url)){window.close()}}if(pattern.info.is(url)){document.querySelector("#intro").click()}
//# sourceMappingURL=ixdzs8tw.user.js.map
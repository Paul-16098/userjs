let ele = [];
let url = window.location.href;

let next_page_url = (
  document.querySelector(
    "body > div.page-d.page-turn > div > a.chapter-paging.chapter-next"
  ) as HTMLAnchorElement
).href;

let pattern = {
  book: {
    pattern: /^\/read\/[0-9]+\/(?!end)p[0-9]*\.html$/gm,
    is: (url: string = location.pathname) => {
      return pattern.book.pattern.test(url);
    },
  },
  info: {
    pattern: /^\/read\/[0-9]+\/$/gm,
    is: (url: string = location.pathname) => {
      return pattern.info.pattern.test(url);
    },
  },
  end: {
    pattern: /^\/read\/[0-9]+\/end\.html$/gm,
    is: (url: string = location.pathname) => {
      return pattern.end.pattern.test(url);
    },
  },
};

if (pattern.book.is()) {
  ele = [
    "#page-id3",
    "#page-toolbar",
    "#page > article > section > p:nth-child(1)",
  ];
  ele.forEach((ele) => {
    if (document.querySelector(ele)) {
      document.querySelector(ele)!.remove();
    }
  });
  GM_addStyle(GM_getResourceText("css1"));
}
if (pattern.end.is() || pattern.end.is(new URL(next_page_url).pathname)) {
  // console.log("end")
  if (pattern.end.is(next_page_url)) {
    document.addEventListener("keydown", function (e) {
      if (!e.repeat) {
        switch (true) {
          case e.key === "ArrowRight": {
            // console.log('(e.key === "ArrowRight") === true');
            window.close();
            break;
          }
          default: {
            // console.log("e: ", e);
            break;
          }
        }
      }
    });
  }
  if (pattern.end.is()) {
    window.close();
  }
}
if (pattern.info.is()) {
  (document.querySelector("#intro") as HTMLElement).click();
}

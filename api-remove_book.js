"use strict";
const id = undefined;
fetch(`https://api.czbooks.net/user/favorite/remove?novelId=${id}`, {
    headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-TW,zh-HK;q=0.9,zh;q=0.8,zh-CN;q=0.7,en;q=0.6",
        priority: "u=1, i",
        "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
    },
    referrer: "https://czbooks.net/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
})
    .then((data) => {
    data.json();
})
    .then((json) => {
    console.log(json);
    return json;
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=api-remove_book.js.map
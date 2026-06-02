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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLXJlbW92ZV9ib29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLXJlbW92ZV9ib29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLEVBQUUsR0FBdUIsU0FBUyxDQUFDO0FBRXpDLEtBQUssQ0FBQyx3REFBd0QsRUFBRSxFQUFFLEVBQUU7SUFDbEUsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLGdEQUFnRDtRQUN4RCxpQkFBaUIsRUFBRSxpREFBaUQ7UUFDcEUsUUFBUSxFQUFFLFFBQVE7UUFDbEIsV0FBVyxFQUNULG1FQUFtRTtRQUNyRSxrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLG9CQUFvQixFQUFFLFdBQVc7UUFDakMsZ0JBQWdCLEVBQUUsT0FBTztRQUN6QixnQkFBZ0IsRUFBRSxNQUFNO1FBQ3hCLGdCQUFnQixFQUFFLFdBQVc7S0FDOUI7SUFDRCxRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLGNBQWMsRUFBRSxpQ0FBaUM7SUFDakQsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLFNBQVM7Q0FDdkIsQ0FBQztLQUNDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO0lBQ2IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0tBQ0QsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0tBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDIn0=
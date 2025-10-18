/// <reference path = "./../Tools/Tools.user.d.ts"/>

let q: string = document
  .evaluate(
    '//*[@id="wpforo-wrap"]/div[3]/div[1]/div/div/div/form/div/div/div/div/div/div[3]/div[1]/div[1]/strong',
    document,
    null,
    XPathResult.STRING_TYPE,
    null
  )
  .stringValue.replace("−", "-")
  .replace("×", "*")
  .split("=")[0]
  .trim();

(
  document.querySelector(
    "#wpforo-wrap > div.wpforo-main > div.wpforo-content > div > div > div > form > div > div > div > div > div > div.wpf-field.wpf-field-type-text.wpf-field-hook > div.wpf-field-wrap > div.aiowps-captcha-equation.hide-when-displaying-tfa-input > strong > input.aiowps-captcha-answer"
  ) as HTMLInputElement
).value = newEval(q);

/// <reference path = "./../Tools/Tools.user.d.ts" />
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

//#if debug
// @require file://c:\Users\pl816\OneDrive\文件\git\userjs\Tools\Tools.user.js
//#else
// #@require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif

// @supportURL   https://github.com/Paul-16098/userjs/issues/
// @homepageURL  https://github.com/Paul-16098/userjs/README.md
// ==/UserScript==

class Config {
  private defaultValue: {
    [key: string]: any;
  };
  constructor() {
    this.defaultValue = {};
  }

  public registerKey(key: string, defaultValue?: any) {
    this.defaultValue[key] = defaultValue;
    return this;
  }
  public registerKeys(keys: { [key: string]: any }) {
    for (const key in keys) {
      this.registerKey(key, keys[key]);
    }
    return this;
  }

  public get(key: string): any {
    return GM_getValue(key, this.defaultValue[key]);
  }
  public set(key: string, value: any) {
    if (!(key in this.defaultValue)) {
      throw new Error(`Config:set: key "${key}" is not registered.`);
    }
    GM_setValue(key, value);
    return this;
  }
  public registerConfigMenu(
    menu?: setMenuFn,
    showMapping?: { [x: string]: string },
  ) {
    for (const key in this.defaultValue) {
      setMenu(key, menu, this.defaultValue[key], showMapping);
    }
  }
}


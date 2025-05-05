declare const _unsafeWindow: Window & Omit<typeof globalThis, "GM_addElement" | "GM_addStyle" | "GM_addValueChangeListener" | "GM_deleteValue" | "GM_download" | "GM_getResourceText" | "GM_getResourceURL" | "GM_getTab" | "GM_getTabs" | "GM_getValue" | "GM_info" | "GM_listValues" | "GM_log" | "GM_notification" | "GM_openInTab" | "GM_registerMenuCommand" | "GM_removeValueChangeListener" | "GM_saveTab" | "GM_setClipboard" | "GM_setValue" | "GM_unregisterMenuCommand" | "GM_xmlhttpRequest" | "GM">;
declare const IS_DEBUG_LOG: boolean;
declare function setGM(): void;
declare function removeElement(...args: Array<string>): unknown[];
type setMenuFn = (ev?: MouseEvent | KeyboardEvent) => void;
declare function setMenu(name: string, fn?: setMenuFn | undefined, showMapping?: {
    [x: string]: string;
} | undefined): number;
declare function newEval(stringCode: string, safety?: boolean): any;
declare class i18n {
    /**
     * 代表包含語言翻譯的JSON對象。
     *
     * 該對像以語言代碼作為頂級key進行構造，每個語言代碼映射到另一個對象，其中鍵是翻譯鍵，值是翻譯字符串。
     *
     * @example
     * ```typescript
     * const translations: langJson = {
     *   "en": {
     *     "greeting": "Hello",
     *     "farewell": "Goodbye"
     *   },
     *   "es": {
     *     "greeting": "Hola",
     *     "farewell": "Adiós"
     *   }
     * };
     * ```
     */
    langJson: {
        [lang: string]: {
            [key: string]: string;
        };
    };
    /**
     * 語言代碼列表。
     *
     * @type {Array<string>}
     */
    langList: Array<string>;
    /**
     * 創建一個I18N實例。
     *
     * @param {langJson} langJson  -語言映射。
     * @param {(string | Array<string>)} lang  -語言代碼或語言代碼列表。
     */
    constructor(langJson: typeof this.langJson, lang: string | Array<string>);
    /**
     * 根據提供的key和可選參數檢索本地化字符串。
     *
     * @param key  -所需局部字符串的key。
     * @param args  -可選的參數以替換本地化字符串中的佔位符。
     * @returns 帶有佔位符的本地化字符串用提供的參數代替，或者一條表示未找到翻譯的消息。
     */
    get(key: keyof (typeof this.langJson)[keyof typeof this.langJson], ...args: Array<any>): string;
    t: (key: keyof (typeof this.langJson)[keyof typeof this.langJson], ...args: Array<any>) => string;
}

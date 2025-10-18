declare const _unsafeWindow: Window & Omit<typeof globalThis, "GM_addElement" | "GM_addStyle" | "GM_addValueChangeListener" | "GM_deleteValue" | "GM_download" | "GM_getResourceText" | "GM_getResourceURL" | "GM_getTab" | "GM_getTabs" | "GM_getValue" | "GM_info" | "GM_listValues" | "GM_log" | "GM_notification" | "GM_openInTab" | "GM_registerMenuCommand" | "GM_removeValueChangeListener" | "GM_saveTab" | "GM_setClipboard" | "GM_setValue" | "GM_unregisterMenuCommand" | "GM_xmlhttpRequest" | "GM">;
declare const IS_DEBUG_LOG: boolean;
/**
 * 從 DOM 中移除指定選擇器的所有元素。
 * @param args - CSS 選擇器字串陣列
 * @returns [true, args] 或 [false, args, error]
 */
declare function removeElement(...args: Array<string>): unknown[];
type setMenuFn = (ev?: MouseEvent | KeyboardEvent) => void;
/**
 * 註冊一個用戶菜單命令，支援布林值自動切換與自定義顯示。
 *
 * @param name - 設定名稱（同時作為 GM 存儲 key）
 * @param fn - (可選) 點擊時執行的函數，若為布林值預設為切換並重載
 * @param def - (可選) 預設值
 * @param showMapping - (可選) 顯示映射表
 * @returns 菜單命令ID
 *
 * @remarks
 * - 如果值為 `name` 是未定義的，且提供了 `def`，則將 `def` 設置為初始值。
 * - 對於布林值，菜單會顯示切換選項，並在變更時重新加載頁面。
 * - 對於不支持的類型，當選擇菜單項時會記錄錯誤。
 */
declare function setMenu(name: string, fn?: setMenuFn, def?: any, showMapping?: {
    [x: string]: string;
} | undefined): number;
declare const blackList: Array<string | RegExp>;
/**
 * 安全執行傳入的字串代碼，支援黑名單過濾。
 * @param stringCode - 要執行的代碼
 * @param safety - 是否啟用安全過濾
 * @returns 執行結果
 * @throws 若包含黑名單關鍵字則丟出錯誤
 */
declare function newEval(stringCode: string, safety?: boolean): any;
/**
 * 多語系(i18n)工具類，支援多語言字典與動態參數替換。
 */
declare class I18n {
    /** 語言字典資料 */
    readonly langJson: {
        [lang: string]: {
            [key: string]: string;
        };
    };
    /** 語言優先順序列表 */
    langList: Array<string>;
    /**
     * 建構子
     * @param langJson - 語言字典
     * @param lang - 語言代碼或語言代碼陣列
     */
    constructor(langJson: typeof this.langJson, lang: string | Array<string>);
    /**
     * 取得本地化字串，支援參數替換。
     * @param key - 字典鍵值
     * @param args - 參數
     * @returns 對應語言的字串，若無則回傳key
     */
    get(key: keyof (typeof this.langJson)[keyof typeof this.langJson], ...args: Array<any>): string;
    /**
     * 別名，等同 get
     */
    t: (key: keyof (typeof this.langJson)[keyof typeof this.langJson], ...args: Array<any>) => string;
}

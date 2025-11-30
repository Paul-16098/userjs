declare enum Language {
    en = "en",
    zh = "zh"
}
/**
 * 用戶配置類，負責管理腳本的各項設置，並註冊菜單。
 */
declare class Config {
    /** 是否開啟偵錯模式 */
    Debug: boolean;
    /** 結束頁是否自動關閉 */
    IsEndClose: boolean;
    /** 是否自動加入書櫃 */
    AutoAddBookcase: boolean;
    /** 自動加入書櫃的封鎖名單（書ID陣列） */
    AutoAddBookcaseBlockade: Array<string>;
    /** 是否攔截alert */
    IsHookAlert: boolean;
    /** 攔截alert的訊息封鎖名單 */
    HookAlertBlockade: Array<Array<any>>;
    /** 語言設定 */
    Language: Language;
    constructor();
    /**
     * 註冊所有配置項的菜單
     */
    private registerConfigMenu;
    /**
     * 將當前配置寫入GM存儲
     */
    private set;
}
declare const config: Config;
declare const i18nData: typeof I18n.prototype.langJson;
interface BookData {
    Updata: {
        url: {
            value: string;
            URLParams: URLSearchParams;
        };
    };
    Mate: {
        BookName: string;
        BookHtmlObj: Element;
        BookImgUrl: string;
    };
}
/**
 * `BookManager` 類別提供了各種方法來管理網頁上與書籍相關的資料並與之互動。
 * 它包括偵測圖書頁面、圖書資訊頁面、結束頁面和書架頁面的功能。
 * 它還提供了處理導航、將書籍添加到書架以及修改頁面元素的方法。
 *
 * @class
 * @classdesc 此類旨在自動化並增強與圖書相關的網站的使用者體驗。
 *
 * @property {Object} data -包含用於偵測和處理書籍相關頁面的各種方法和模式。
 * @property {Function} data.HasBookInfo  -檢查是否可用書籍信息。
 * @property {Function} data.IsBookshelf  -檢查當前頁面是否是書架頁面。
 * @property {Object} data.Book  -包含與書籍操作有關的方法。
 * @property {Function} data.Book.GetAid  -檢索書ID。
 * @property {Function} data.Book.GetCid  -檢索章節ID。
 * @property {RegExp} data.Book.pattern  -標識書頁的模式。
 * @property {Function} data.Book.Is  -檢查當前頁面是否是書頁。
 * @property {Object} data.Info  -包含與書籍信息操作有關的方法。
 * @property {RegExp} data.Info.pattern  -識別圖書信息頁面的模式。
 * @property {Function} data.Info.Is  -檢查當前頁面是否是書籍信息頁面。
 * @property {Object} data.End  -包含與最終頁面操作相關的方法。
 * @property {Function} data.End.Is  -檢查當前頁面是否是結束頁面。
 * @property {Function} data.GetNextPageUrl  -檢索下一頁的URL。
 * @property {Function} data.IsNextEnd  -檢查下一頁是否是終點頁面。
 * @property {Function} data.IsBiz  -檢查當前域是否為“ 69shu.biz”。
 *
 * @constructor
 * @description 初始化 `Bookmanager` 類的新實例。它註冊了配置菜單並處理不同類型的頁面（書籍, 書籍信息, 結束, 書架）。如果設置了 `config.debug` 標誌, 它還記錄了調試信息。
 * @throws 如果發生錯誤並且未設置 `config.debug` , 將提醒用户。
 *
 * @method handleBookPage
 * @description 透過執行各種修改和增強來處理書籍頁面。
 * @private
 * @returns {void}
 *
 * @method hookAlert
 * @description 掛鈎全域「警報」功能以有條件地阻止或記錄警報訊息。
 * @private
 * @returns {void}
 *
 * @method addStyles
 * @description 透過從指定資源注入 CSS 內容, 將自訂樣式新增至文件。
 * @private
 * @returns {void}
 *
 * @method modifyPageNavigation
 * @description 透過刪除現有的「onkeydown」事件處理程序並新增新的「keydown」事件偵聽器來修改頁面導航。
 * @private
 * @returns {void}
 *
 * @method keydownHandler
 * @description 處理鍵盤事件, 以便在按下「向右箭頭」鍵時導覽至下一頁。
 * @private
 * @param {KeyboardEvent} e -鍵盤事件物件。
 * @returns {void}
 *
 * @method addBookcase
 * @description 將當前的書添加到書架中。
 * @private
 * @returns {void}
 *
 * @method insertAuthorLink
 * @description 插入作者鏈接並用新鏈接替換標題DIV。
 * @private
 * @returns {void}
 *
 * @method handleBookshelf
 * @description 通過收集書籍數據和註冊菜單命令來處理書架。
 * @private
 * @returns {Promise<void>}
 *
 * @method collectBookData
 * @description 通過以 `book_` 開頭查詢ID, 從DOM收集書籍數據。
 * @private
 * @param {number} [retryCount=0]  -當前的重試計數。
 * @returns {Promise<BookData[]>}  -解決一系列收集的書籍數據的承諾。
 *
 * @method registerMenuCommand
 * @description 註冊菜單命令, 其中包含收集的書籍數據。
 * @private
 * @param {BookData[]} bookData  -收集的書籍數據。
 * @returns {void}
 *
 * @method debugInfo
 * @description 收集和返回調試信息。
 * @private
 * @returns {Object}  -調試信息。
 *
 * @method registerConfigMenu
 * @description 註冊配置菜單。
 * @private
 * @returns {void}
 */
declare class BookManager {
    /** 常用選擇器集合 */
    SELECTORS: {
        nextPage: string[];
        authorInfo: string;
        titleDiv: string;
        searchInput: string;
        searchForm: string;
    };
    /**
     * 各種頁面判斷與數據獲取方法集合
     */
    private readonly data;
    i18nInstance: I18n;
    t: typeof I18n.prototype.t;
    /**
     * 取得下一頁的a元素
     */
    getNextPageElement(): HTMLAnchorElement | null;
    /**
     * 構造函數，根據當前頁面自動分派對應處理
     */
    constructor();
    /**
     * 書頁自動化處理：樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接
     */
    private handleBookPage;
    /**
     * 自動加入書櫃（如未在封鎖名單）
     */
    private autoAddToBookcase;
    /**
     * 更新下一頁鏈接，附加FromBook參數
     */
    private updateNextPageLink;
    /**
     * 攔截全局alert，根據封鎖名單過濾
     */
    private hookAlert;
    /**
     * 注入自定義CSS樣式
     */
    private addStyles;
    /**
     * 移除原有onkeydown，註冊自定義鍵盤導航
     */
    private modifyPageNavigation;
    /**
     * 處理右鍵導航與結束自動關閉
     */
    private keydownHandler;
    /**
     * 加入書櫃（根據不同站點呼叫不同API或模擬點擊）
     */
    private addBookcase;
    /**
     * 替換標題div為帶有作者連結的新元素
     */
    private insertAuthorLink;
    /**
     * 建立作者頁面連結元素
     */
    private createAuthorLink;
    /**
     * 建立書名連結元素
     */
    private createTitleLink;
    /**
     * 書架頁面：收集書籍資料並註冊菜單
     */
    private handleBookshelf;
    /**
     * 搜尋功能：自動填入並提交表單
     */
    private performSearch;
    /**
     * 遞迴收集書架書籍資料，最多重試5次
     */
    private collectBookData;
    /**
     * 註冊菜單命令，點擊可批量打開所有更新書籍
     */
    private registerMenuCommand;
    /**
     * 輸出調試資訊
     */
    private debugInfo;
}
declare const bookManager: BookManager;

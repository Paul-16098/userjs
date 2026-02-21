/** 語言選項枚舉 */
declare enum Language {
    en = "en",
    zh = "zh"
}
/** 用戶配置類，負責管理腳本的各項設置，並註冊菜單 */
declare class Config {
    /** 是否開啟偵錯模式 */
    Debug: boolean;
    /** 結束頁是否自動關閉 */
    IsEndClose: boolean;
    /** 是否自動加入書櫃 */
    AutoAddBookcase: boolean;
    /** 自動加入書櫃的封鎖名單(書ID陣列) */
    AutoAddBookcaseBlockade: Array<string>;
    /** 是否攔截alert */
    IsHookAlert: boolean;
    /** 攔截alert的訊息封鎖名單 */
    HookAlertBlockade: Array<Array<any>>;
    /** 語言設定 */
    Language: Language;
    constructor();
    /** 註冊所有配置項的菜單 */
    private registerConfigMenu;
    /** 將當前配置寫入GM存儲 */
    private set;
}
/** 書籍數據接口 */
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
interface Site {
    /** 常用選擇器集合 */
    readonly SELECTORS: {
        /** 下一頁按鈕選擇器 */
        nextPage: string;
        /** 作者信息選擇器 */
        authorInfo: string;
        /** 標題區域選擇器 */
        titleDiv: string;
        /** 搜索輸入框選擇器 */
        searchInput: string;
        /** 搜索表單選擇器 */
        searchForm: string;
        /** 需要移除的元素選擇器陣列 */
        ElementNeedRemove: string[];
    };
    /** 是否有書籍信息 */
    readonly HasBookInfo: boolean;
    /** 是否在書架頁面 */
    readonly IsBookshelf: () => boolean;
    readonly Book: {
        /** 獲取書籍ID */
        GetAid: () => string;
        /** 獲取章節ID */
        GetCid: () => string;
        pattern: RegExp;
        Is: () => boolean;
    };
    readonly Info: {
        pattern: RegExp;
        Is: () => boolean;
    };
    readonly End: {
        pattern?: RegExp;
        Is: (pathname?: string) => boolean;
    };
    readonly isSite: boolean;
}
declare class Site_tw implements Site {
    SELECTORS: {
        nextPage: string;
        authorInfo: string;
        titleDiv: string;
        searchInput: string;
        searchForm: string;
        ElementNeedRemove: string[];
    };
    HasBookInfo: boolean;
    IsBookshelf: () => boolean;
    Book: {
        GetAid: () => string;
        /** 獲取章節ID */
        GetCid: () => string;
        /** 書籍URL模式 */
        pattern: RegExp;
        /** 判斷是否為書籍頁面 */
        Is: () => boolean;
    };
    Info: {
        pattern: RegExp;
        /** 判斷是否為書籍信息頁面 */
        Is: (pathname?: string) => boolean;
    };
    End: {
        pattern: RegExp;
        Is: (pathname?: string) => boolean;
    };
    isSite: boolean;
}
declare class Site_69shuba implements Site {
    SELECTORS: {
        nextPage: string;
        authorInfo: string;
        titleDiv: string;
        searchInput: string;
        searchForm: string;
        ElementNeedRemove: string[];
    };
    HasBookInfo: boolean;
    IsBookshelf: () => boolean;
    Book: {
        GetAid: () => string;
        /** 獲取章節ID */
        GetCid: () => string;
        pattern: RegExp;
        Is: () => boolean;
    };
    Info: {
        pattern: RegExp;
        Is: () => boolean;
    };
    End: {
        Is: () => boolean;
    };
    isSite: boolean;
}
declare class BookManager {
    readonly Site: Site;
    /** i18n 處理實例，用於管理當前語言與字典資料 */
    readonly i18nInstance: I18n;
    /** 綁定的翻譯方法，避免 this 指向錯誤 */
    readonly t: typeof I18n.prototype.t;
    /** 取得下一頁的元素 */
    getNextPageElement(): HTMLAnchorElement | null;
    /** 構造函數，根據當前頁面自動分派對應處理 */
    constructor(Site: Site);
    /** 書頁自動化處理: 樣式、導航、元素移除、書櫃、作者連結、下一頁鏈接 */
    private handleBookPage;
    /** 替換文本內容，根據替換字典進行替換 */
    private replaceText;
    /** 自動加入書櫃(如未在封鎖名單) */
    private addToBookcase;
    /** 更新下一頁鏈接，附加FromBook參數 */
    private updateNextPageLink;
    /** 攔截全局alert，根據封鎖名單過濾 */
    private hookAlert;
    /** 注入自定義CSS樣式 */
    private addStyles;
    /** 移除原有onkeydown，註冊自定義鍵盤導航 */
    private modifyPageNavigation;
    /** 處理右鍵導航與結束自動關閉 */
    private keydownHandler;
    /** 加入書櫃(根據不同站點呼叫不同API或模擬點擊) */
    private addBookcase;
    /** 替換標題div為帶有作者連結的新元素 */
    private insertAuthorLink;
    /** 建立作者頁面連結元素 */
    private createAuthorLink;
    /** 建立書名連結元素 */
    private createTitleLink;
    /** 書架頁面: 收集書籍資料並註冊菜單 */
    private handleBookshelf;
    /** 搜尋功能: 自動填入並提交表單 */
    private performSearch;
    /** 遞迴收集書架書籍資料，最多重試5次 */
    private collectBookData;
    /** 註冊菜單命令，點擊可批量打開所有更新書籍 */
    private registerOpenUpdateBookMenuCommand;
    /** 輸出調試資訊 */
    private debugInfo;
}
/** 配置初始化 */
declare const config: Config;
/** i18n 設定 */
declare const i18nData: typeof I18n.prototype.langJson;
declare const SiteList: Site[];

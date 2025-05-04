interface Config {
    Debug: boolean;
    IsEndClose: boolean;
    AutoAddBookcase: boolean;
    AutoAddBookcaseBlockade: Array<string>;
    IsHookAlert: boolean;
    HookAlertBlockade: Array<Array<any>>;
    Search: string;
}
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
declare const config: Config;
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
    SELECTORS: {
        nextPage: string[];
        authorInfo: string;
        titleDiv: string;
        searchInput: string;
        searchForm: string;
    };
    private data;
    getNextPageElement(): HTMLAnchorElement | null;
    /**
     * 初始化類別的新實例。
     *
     * 此構造函數執行以下操作：
     * - 註冊配置選單。
     * - 檢查目前頁面是否為圖書頁面、圖書資訊頁面、結束頁面或書架頁面, 並相應地處理每種情況。
     * - 如果設定了 `config.Debug` 標誌, 則記錄偵錯資訊。
     * - 如果找不到符合的 URL 模式, 則提醒使用者。
     * - 擷取並記錄執行期間發生的任何錯誤。
     *
     * @throws 如果發生錯誤且未設定 `config.Debug` , 將提醒使用者。
     */
    constructor();
    /**
     * 通過執行各種修改和增強來處理書頁。
     *
     *  - 如果啟用了 `config.IsHookAlert` , 則不顯示`alert`。
     *  - 將自定義樣式添加到頁面上。
     *  - 修改頁面導航元素。
     *  - 從頁面上刪除指定的元素。
     *  - 如果啟用了自動添加書架配置, 則將書添加到書架中。
     *  - 插入指向作者頁面的鏈接。
     *  - 更新下一頁鏈接以包含一個查詢參數, 該參數指示本書導航。
     *
     * @private
     * @returns {void}
     */
    private handleBookPage;
    private autoAddToBookcase;
    private updateNextPageLink;
    /**
     * 將掛接到全局 `alert` 函數中, 以有條件阻止或日誌警報消息。
     *
     * 此功能用自定義實現替換默認的 `alert` 函數, 該函數可根據 `config.HookAlertBlockade` 數組中定義的封鎖列表檢查每個警報消息。
     * 如果該消息與任何封鎖匹配（或者將封鎖設置為`*`）, 則該警報將被封鎖。
     * 否則, 該警報會照常顯示。
     *
     * 此外, 如果啟用了偵錯（`config.Debug`）, 警報訊息將記錄到控制枱。
     *
     * @private
     * @function hookAlert
     * @returns {void}
     */
    private hookAlert;
    /**
     * 透過從指定資源檢索 CSS 內容並將其註入到頁面中, 將自訂樣式新增至文件。如果在設定中啟用了偵錯, 則會向控制枱記錄一則訊息, 指示 CSS 已新增。
     *
     * @private
     * @returns {void}
     */
    private addStyles;
    /**
     * 透過刪除任何現有的 `onkeydown` 事件處理程序並新增使用 `keydownHandler` 方法的新 `keydown` 事件偵聽器來修改頁面導覽。
     *
     * @private
     */
    private modifyPageNavigation;
    /**
     * 按下 `Arrowright` 鍵時, 處理鍵盤事件, 用於導航到下一頁。
     *
     * @param e - 鍵盤事件對象。
     *
     * 此方法執行以下操作：
     *  -檢查是否按下 `Arrowright` 鍵, 並且事件不是重複。
     *  -使用`this.data.GetNextPageUrl()`檢索下一頁的URL。
     *  -如果找到下一頁URL, 它將附加查詢參數`frombook = true`到URL並導航到它。
     *  -如果下一頁已結束並且設定了 `config.IsEndClose` 標誌, 則會關閉視窗。
     */
    private keydownHandler;
    /**
     * 將目前書籍加入書櫃。
     *
     * 此方法從數據對像中檢索了本書的AID和CID, 並試圖將書添加到書架中。
     * 如果`addbookCase`函數不包含字符串“ ajax.tip”, 則用AID和CID調用`addBookCase`。
     * 否則, 它會模擬使用ID `A_ADDBOOKCASE` 的單擊元素, 以將書添加到書櫃中。
     *
     * @private
     */
    private addBookcase;
    /**
     * 插入作者連結並用新連結取代標題 div。
     * 此方法執行以下操作：
     * 1. 從指定的 DOM 元素中檢索作者姓名。
     * 2. 建立連結到作者頁面的錨元素並設定其文字內容和樣式。
     * 3. 找到標題 div 並將其替換為包含書名的新錨元素。
     * 新標題連結的 href 是根據該書是否是商業書籍構建的。
     * 標題文字是根據圖書資訊的存在而決定的。
     */
    private insertAuthorLink;
    private createAuthorLink;
    private createTitleLink;
    /**
     * 透過收集書籍資料並註冊選單命令來處理書架。
     *
     * @returns {Promise<void>} 當書架處理完成時, 這個承諾就得到解決。
     * @private
     */
    private handleBookshelf;
    private performSearch;
    /**
     * 透過查詢 ID 以 `book_` 開頭的元素, 從 DOM 收集圖書資料。
     * 如果未找到標籤, 則會重試最多 5 次, 每次重試之間有 5 秒的延遲。
     *
     * @param {number} [retryCount=0] - 目前重試次數。
     * @returns {Promise<BookData[]>} - 解決一系列收集的書籍數據的承諾。
     *
     * @remarks
     * - 如果達到最大重試次數而沒有找到任何標籤, 則傳回空數組。
     * - 如果啟用`config.Debug`, 則會將其他偵錯資訊記錄到控制枱。
     *
     * @private
     */
    private collectBookData;
    private registerMenuCommand;
    private debugInfo;
    private registerConfigMenu;
}
declare const bookManager: BookManager;

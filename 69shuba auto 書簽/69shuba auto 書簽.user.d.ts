interface Config {
    Debug: boolean;
    IsEndClose: boolean;
    AutoAddBookcase: boolean;
    IsHookAlert: boolean;
    HookAlertBlockade: Array<Array<any>>;
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
        Book_HTML_obj: Element;
        BookImgUrl: string;
    };
}
declare const config: Config;
declare class BookManager {
    private data;
    constructor();
    run(): void;
    private handleBookPage;
    private hookAlert;
    private addStyles;
    private modifyPageNavigation;
    private keydownHandler;
    private addBookcase;
    private insertAuthorLink;
    private handleBookshelf;
    private collectBookData;
    private registerMenuCommand;
    private debugInfo;
    private registerConfigMenu;
}
declare const bookManager: BookManager;

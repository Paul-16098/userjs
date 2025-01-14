interface Config {
    Debug: boolean;
    IsEndClose: boolean;
    AutoAddBookcase: boolean;
    IsHookAlert: boolean;
    HookAlertBlockade: Array<Array<any>>;
}
interface BookData {
    Updata: {
        HTML_obj: Element;
        url: {
            value: string;
            URLParams: {
                obj: URLSearchParams;
            };
        };
    };
    Mark: {
        HTML_obj: Element;
        url: {
            value: string;
            URLParams: {
                obj: URLSearchParams;
            };
        };
    };
    BookMate: {
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

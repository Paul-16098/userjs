declare const Debug: boolean;
declare const IsEndClose: boolean;
declare const AutoAddBookcase: boolean;
declare const IsHookAlert: boolean;
declare const HookAlertBlockade: Array<Array<any>>;
declare const data: {
    Has_bookinfo: () => boolean;
    IsBookshelf: (href?: string) => boolean;
    Book: {
        GetAid: (href?: string) => string;
        GetCid: (href?: string) => string;
        pattern: RegExp;
        Is: (href?: string) => boolean;
    };
    Info: {
        pattern: RegExp;
        Is: (href?: string) => boolean;
    };
    End: {
        Is: (href?: string) => boolean;
    };
    GetNextPageUrl: () => string | undefined;
    IsNextEnd: () => boolean;
    IsBiz: (host?: string) => boolean;
};
declare let ele: Array<string>;
declare let run: boolean;

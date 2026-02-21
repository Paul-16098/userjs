declare let ele: any[];
declare let url: string;
declare let next_page_url: string;
declare let pattern: {
    book: {
        pattern: RegExp;
        is: (url?: string) => boolean;
    };
    info: {
        pattern: RegExp;
        is: (url?: string) => boolean;
    };
    end: {
        pattern: RegExp;
        is: (url?: string) => boolean;
    };
};

declare class Config {
    private defaultValue;
    constructor();
    registerKey(key: string, defaultValue?: any): this;
    registerKeys(keys: {
        [key: string]: any;
    }): this;
    get(key: string): any;
    set(key: string, value: any): this;
    registerConfigMenu(menu?: setMenuFn, showMapping?: {
        [x: string]: string;
    }): void;
}

declare const _unsafeWindow: Window & Omit<typeof globalThis, "GM_addElement" | "GM_addStyle" | "GM_addValueChangeListener" | "GM_deleteValue" | "GM_download" | "GM_getResourceText" | "GM_getResourceURL" | "GM_getTab" | "GM_getTabs" | "GM_getValue" | "GM_info" | "GM_listValues" | "GM_log" | "GM_notification" | "GM_openInTab" | "GM_registerMenuCommand" | "GM_removeValueChangeListener" | "GM_saveTab" | "GM_setClipboard" | "GM_setValue" | "GM_unregisterMenuCommand" | "GM_xmlhttpRequest" | "GM">;
declare const IS_DEBUG_LOG: boolean;
declare function setGM(): void;
declare function remove_ele(...args: Array<string>): unknown[];
declare function setMenu(name: string, fn?: ((ev?: MouseEvent | KeyboardEvent) => void) | undefined, showValueMapping?: {
    [x: string]: string;
} | undefined): number;
declare function newEval(stringCode: string, safety?: boolean): any;

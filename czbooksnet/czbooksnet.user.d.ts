/**
 * 取得並注入自定義CSS樣式
 */
declare let css1: string;
/**
 * 判斷是否為深色模式
 */
declare const isDarkMode: boolean;
/**
 * 切換背景主題（預設/白色）
 * @param params - "default" 為深色，"white" 為淺色
 */
declare function changeBackground(params: "default" | "white"): void;

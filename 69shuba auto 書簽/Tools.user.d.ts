declare const _unsafeWindow: Window | typeof unsafeWindow | typeof globalThis;

declare const IS_DEBUG_LOG: boolean;

declare function setGM(): void;

declare function remove_ele(...args: string[]): any[];

declare function setMenu(
  name: string,
  fn?: ((ev?: MouseEvent | KeyboardEvent) => void) | undefined,
  showValueMapping?:
    | {
        [x: string]: string;
      }
    | undefined
): number;

declare function newEval(args: string): any;

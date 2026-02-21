# userjs — Tampermonkey/Greasemonkey 使用者腳本集合

本倉庫是一個以 TypeScript 撰寫、以 SWC 編譯的使用者腳本（Userscripts）單一倉庫（monorepo）。每個資料夾代表一組對應網站的腳本。

- 腳本管理器：建議使用 Tampermonkey（Chrome/Edge/Firefox 等）或 Greasemonkey/Violentmonkey
- 分支慣例：開發分支 `dev`、預設分支 `main`

## 快速安裝（使用者）

1. 先安裝瀏覽器擴充：Tampermonkey（或相容管理器）

2. 點擊下列「安裝」連結（指向 GitHub raw 的 `dev` 分支）：

- 69shuba auto 書簽 — [安裝連結](https://github.com/Paul-16098/userjs/raw/refs/heads/dev/69shuba%20auto%20%E6%9B%B8%E7%B0%BD/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js)
- 琉璃神社 — [安裝連結](https://github.com/Paul-16098/userjs/raw/refs/heads/dev/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.user.js)
- czbooksnet — [安裝連結](https://github.com/Paul-16098/userjs/raw/refs/heads/dev/czbooksnet/czbooksnet.user.js)
- ixdzs8tw — [安裝連結](https://github.com/Paul-16098/userjs/raw/refs/heads/dev/ixdzs8tw/ixdzs8tw.user.js)

安裝後，Tampermonkey 會提示新增腳本，按「安裝」即可。

> 提示：上述連結使用 `dev` 分支的 raw 檔案，方便追到最新版。若要使用穩定版，請改用 `main` 分支路徑。

## 專案結構與慣例

- 一個資料夾對應一個網站/腳本：
  - 例如 `69shuba auto 書簽/`、`czbooksnet/`、`琉璃神社/`、`ixdzs8tw/`
  - 內含 `*.user.ts` 入口檔（編譯成同名 `.user.js`）、可選的 CSS/JSON 資源、與局部 `tsconfig.json`
- 共享工具放在 `Tools/Tools.user.ts`，其他腳本以 Tampermonkey `@require` 引入（並搭配 `Tools.user.d.ts` 提供型別）
- SWC 以 VS Code Tasks 執行（專案未提交 `.swcrc`，設定由 Tasks 參數提供）
- 腳本中常見模式：
  - 透過 `Tools` 提供的 `setMenu`、`i18n`、`removeElement`、`newEval` 等輔助
  - 需要樣式時以 `@resource` + `GM_getResourceText` + `GM_addStyle` 注入

## 開發與建置（貢獻者）

前置需求：

- Node.js（可用 npx）
- VS Code（建議，因已內建 Tasks）
- Tampermonkey（本機測試）

步驟：

1. 在 VS Code 中執行 Tasks
   - 單次編譯：任務「swc: build」— 會編譯所有 `**/*.user.ts` 為同目錄下的 `.user.js` 與來源對應檔（source maps）
   - 監看模式：任務「swc: watch」— 開發時持續編譯
2. 編譯設定（由 Tasks 參數提供）：
   - TypeScript parser、`module=commonjs`、`target=esnext`、`minify=true`、`sourceMaps=true`、`comments=all`
3. 腳本約定：
   - 每個資料夾一份局部 `tsconfig.json`，輸出至同資料夾
   - 共用型別：於腳本頂部加入 `/// <reference path="./../Tools/Tools.user.d.ts"/>`

> 若需要以指令執行：亦可直接在專案根目錄執行 swc（但通常以 VS Code Tasks 為主）。

## 條件式 @require 與版本號規範

本倉庫提供 `update_version.py` 與 `F.json` 控制「本地開發」與「遠端引用」。維護腳本頭部的 `@version` 與 `@require` 條件區塊。

- 當 `F.json` 中 `{ "debug": true }`：啟用本地 `file://` 的 `@require`
- 當 `{ "debug": false }`：保留遠端 `@require`（指向本倉庫 `dev` 分支 raw 檔案）

請在新腳本維持下列區塊形狀，供 `update_version.py` 正確處理（勿更動註解符號與縮排）：

```text
//#if debug
// #@require file://C:\\Users\\p\\Documents\\git\\userjs\\Tools\\Tools.user.js
//#else
// @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
//#endif
```

`update_version.py` 也會清理 `// @version` 行，將如 `-beta*` 等尾碼移除，統一為純數字。

## 共享工具（Tools）

- 檔案：`Tools/Tools.user.ts`（輸出 `Tools.user.js` 與 `Tools.user.d.ts`）
- 功能重點：
  - `removeElement(...selectors)`：移除不需要的 DOM 節點
  - `setMenu(name, fn?, def?, showMapping?)`：註冊/切換 GM 選單與配置
  - `i18n`：簡易鍵值翻譯；`t(key, ...args)` 取得字串
  - `newEval(code, safety=true)`：安全地評估簡單運算字串
  - `setGM()`：對齊不同腳本管理器的 GM API 差異
- 型別支援：在各腳本加上 `/// <reference path="./../Tools/Tools.user.d.ts"/>` 取得型別提示

## 載入 CSS/JSON 資源的慣例

- 在腳本 metadata header 中加入 `@resource`
- 於程式中：
  - `const css = GM_getResourceText("css1");`
  - `GM_addStyle(css);`

可參考 `czbooksnet/czbooksnet.user.ts` 的作法。

## 資料夾導覽

```text
<repo-root>
├─ 69shuba auto 書簽/
│  ├─ 69shuba auto 書簽.user.ts  # 入口 TypeScript（輸出同名 .user.js）
│  ├─ *.less / *.css / *.json     # 可選資源，與腳本同層
│  └─ tsconfig.json               # 區域 TS 設定（emit 到同資料夾）
├─ 琉璃神社/
├─ czbooksnet/
├─ ixdzs8tw/
├─ Tools/
│  ├─ Tools.user.ts               # 共享工具（搭配 d.ts 型別）
│  └─ Tools.user.d.ts
├─ update_version.py              # 正規化 @version 與條件式 @require
├─ F.json                         # 旗標（例如 { "debug": false }）
├─ package.json                   # npx swc 由 VS Code Tasks 呼叫
└─ LICENSE.txt
```

## 釋出與版本

- 開發：主要在 `dev` 分支演進，raw 連結指向 `refs/heads/dev` 以便測試
- 穩定：合併至 `main` 後視需求更新文件
- 版本號：使用 `update_version.py` 正規化版本欄位

## 常見問題（FAQ）

- 為什麼看到成對的 `@require`？
  - 這是條件化區塊，`debug=true` 時啟用本地 `file://`，否則使用遠端 raw 檔，利於本地開發與發佈切換
- 我需要另外安裝 `Tools.user.js` 嗎？
  - 不需要。各腳本會以 `@require` 引入；只要從上方「安裝」連結安裝對應腳本即可
- 我要如何為某網站新增一支腳本？
  1. 新增資料夾，複製相鄰資料夾的 `tsconfig.json`
  2. 建立 `Your Script.user.ts`，參考現有檔案的 metadata header 與條件式 `@require`
  3. 如需樣式或資料，將資源檔放同資料夾，並以 `@resource` 載入
  4. 以「swc: watch」開發，完成後執行 `update_version.py`

## 貢獻

歡迎 Issue/PR。請維持：

- 一個資料夾一支腳本的結構
- 嚴謹的 TypeScript 型別
- 一致的 metadata header 與條件式 `@require` 區塊
- 最小必要的 `@grant` 權限

提交訊息格式可參考倉庫內規範（如「git 提交信息規範」）。

## 授權

授權內容請見根目錄 `LICENSE.txt`。

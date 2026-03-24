# Copilot 使用说明（仓库级）

目的

- 为 Copilot / AI agent 提供本仓库的开发约定、构建/测试命令、关键文件位置与常见陷阱，以便自动化助手能可靠地完成代码生成、格式化、lint、build 与 PR 建议。

快速上手

- 推荐包管理器：pnpm（仓库含 `pnpm-lock.yaml` / `pnpm-workspace.yaml`）。
- 安装依赖：`pnpm install`
- 常用命令：
  - 构建（TypeScript 子模块）：`pnpm run build`（会逐个 `tsc -p` 子目录）
  - 编译 less：`pnpm run build:less`
  - 静态检查：`pnpm run lint`
  - 自动修复：`pnpm run lint:fix`

构建与测试 约定

- 每个脚本目录（如 `Tools/`, `czbooksnet/`, `69shuba auto 書簽/`, `琉璃神社/`, `Config/`）都有局部 `tsconfig.json`，通常继承根 `tsconfig.json`。
- `package.json` 的 `build` 脚本通过 `tsc -p <subdir>` 编译各模块；请勿私自替换为不同的全局构建流程，除非同时更新 README 与 CI 配置。

代码风格与 lint

- ESLint 配置位于 `eslint.config.mjs`，使用 `@typescript-eslint` 与 `eslint-plugin-userscripts`。
- 修改/新增 TypeScript 文件前请运行 `pnpm run lint` 并在提交前修复警告。

重要文件与参考

- `README.md` — 项目总体说明与开发流程（优先参考）
- `package.json` — 可用脚本（build、lint、build:less 等）
- `tsconfig.json`（根与子目录）— TypeScript 配置
- `eslint.config.mjs` — lint 规则与全局定义
- `Tools/Tools.user.ts` 与 `Tools/Tools.user.d.ts` — 仓库共享工具与全局类型，agent 在修改脚本时应保留或遵循这些全局约定
- `update_version.py` — 与 user script metadata（header）版本更新相关的辅助脚本，修改 metadata 时请遵循该脚本格式

常见陷阱（Agent 注意事项）

- Metadata 头部：大量脚本含 UserScript header（`@grant` / `@resource` 等），agent 修改这些 header 前应检查 `update_version.py` 与 README 中的约定。

如何让 Copilot / Agent 帮忙（示例 prompts）

- "请帮我为 `czbooksnet/czbooksnet.user.ts` 添加一个新的功能，并确保通过 `pnpm run lint` 和 `pnpm run build`。列出所修改的文件与变更理由。"
- "生成一个测试说明，教新人如何用 pnpm 在本仓库编译所有脚本目录并运行 lint。"
- "请检查所有 `*.user.ts` 文件的 UserScript header，确保 `@version` 字段遵循仓库的版本格式（引用 `update_version.py`）。"

提交与 PR 约定

- 在更改构建、tsconfig 或 lint 配置时，请在 PR 描述中说明动机与兼容性影响，并运行 `pnpm run lint` 与 `pnpm run build` 验证无误。

后续建议

- 可根据需要把本文件拆分为多份 `applyTo` 规则（例如：`/Tools/**`、`/scripts/**`、`/*.user.ts`）以更精细控制 agent 行为。

---

最后更新：自动生成草案。若需要我将其合并到仓库并创建 PR（或改写为 `AGENTS.md`），我可以继续操作。

## 本仓库新增执行规则（2026-03-24）

适用范围：仅本仓库（`userjs`）。

### 规则分级

- **PREFER（偏好）**：优先使用 `pnpm` 执行安装与脚本命令。
  - 示例：`pnpm install`、`pnpm run lint`、`pnpm run build`
  - 若外部流程必须使用其他包管理器，可说明原因后执行。

- **MUST（硬约束）**：涉及代码变更时，交付前必须通过 lint/build。
  - 最低验收：`pnpm run lint` 与 `pnpm run build`
  - 若改动仅涉及 less，也需保证相关构建链路可用（必要时执行 `pnpm run build:less`）。

### Agent 执行清单（提交前）

1. 确认变更影响范围（TS、less、metadata、构建配置）。
2. 执行并通过 `pnpm run lint`。
3. 执行并通过 `pnpm run build`。
4. 在说明中简述验证结果；若有例外，必须写明原因与风险。

### 失败处理约定

- lint/build 任一失败时，不得宣称任务完成。
- 必须继续修复，或明确阻塞点（含错误摘要、影响文件、下一步建议）。

# userjs

一个以 TypeScript 为主的 Userscript（油猴脚本）仓库，按站点拆分目录进行维护，包含通用工具、样式资源与构建脚本。

## 项目简介

本仓库用于维护多个站点脚本，每个脚本目录独立管理：

- 入口文件通常为 `*.user.ts`（编译产物为 `*.user.js`）
- 每个脚本目录一般有自己的 `tsconfig.json`
- 共享能力集中在 `Tools/Tools.user.ts`
- Less 资源通过统一脚本编译

适合场景：

- 在多个站点复用同一套工具函数
- 统一 lint / build 规范
- 使用 pnpm 管理依赖与脚本命令

## 目录结构

当前仓库的主要目录如下：

- `Tools/`：共享工具脚本与类型声明
- `Config/`：配置类脚本
- `czbooksnet/`：`czbooksnet` 相关脚本与样式
- `69shuba auto 書簽/`：69shuba 相关脚本与资源
- `琉璃神社/`：琉璃神社相关脚本
- `scripts/`：仓库级辅助脚本（如 less 编译）

根目录关键文件：

- `package.json`：脚本命令与依赖
- `tsconfig.json`：根级 TypeScript 配置
- `eslint.config.mjs`：ESLint 配置
- `update_version.py`：Userscript metadata 版本处理辅助脚本
- `pnpm-lock.yaml` / `pnpm-workspace.yaml`：pnpm 锁定与工作区配置

## 环境要求

- Node.js（建议使用较新 LTS 版本）
- pnpm

## 快速开始

1. 安装依赖

   `pnpm install`

2. 代码检查

   `pnpm run lint`

3. 自动修复可修复问题

   `pnpm run lint:fix`

4. 编译 TypeScript 子模块

   `pnpm run build`

5. 编译 less 资源（如有改动）

   `pnpm run build:less`

## 可用脚本命令

基于 `package.json` 当前定义：

- `pnpm run build`：依次编译 `Tools`、`czbooksnet`、`琉璃神社`、`69shuba auto 書簽`、`Config`
- `pnpm run build:less`：执行 `scripts/compile-less.js`
- `pnpm run lint`：运行 ESLint
- `pnpm run lint:fix`：运行 ESLint 自动修复

## 开发约定

- 优先使用 `pnpm` 执行安装与脚本命令
- 涉及代码改动时，提交前至少确保：
  - `pnpm run lint` 通过
  - `pnpm run build` 通过
- 保持“一个脚本目录一套局部配置”的组织方式
- 修改 Userscript metadata（如 `@version`、`@grant`、`@resource`）时，注意与仓库现有处理流程一致

## 开发流程（建议）

1. 新建分支并在对应脚本目录开发
2. 完成功能后执行 `pnpm run lint`
3. 执行 `pnpm run build` 验证编译
4. 若涉及样式资源，补充执行 `pnpm run build:less`
5. 再进行提交与 PR

## 常见问题

### 为什么要拆分多个脚本目录？

不同站点逻辑差异较大，拆分目录可以降低耦合、提升可维护性。

### 为什么还需要 `Tools/`？

用于沉淀跨站点可复用逻辑，避免在各脚本中重复实现。

### 什么时候需要运行 `build:less`？

当你修改了 less 文件，或者依赖 less 编译产物参与脚本样式注入时。

## 贡献

欢迎通过 Issue / PR 参与改进。提交前请确保 lint/build 验证通过，并在描述中说明改动范围与目的。

## 许可证

详见根目录 `LICENSE.txt`。

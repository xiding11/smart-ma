# Dittofeed 本地开发环境指南

## 概述

本指南旨在为 Dittofeed 项目的开发人员提供一个统一、高效的本地开发环境搭建与使用指引。该环境通过 `dev-start.sh` 脚本进行管理，简化了服务的启动、停止和初始化流程。

## 1. 前提条件

在开始之前，请确保您的系统已安装以下软件：

*   **Git**: 用于版本控制。
*   **Node.js**: 推荐使用 v18 或更高版本。
*   **Yarn**: 用于包管理。
*   **Docker 和 Docker Compose**: 用于运行基础设施服务。

## 2. 快速入门

按照以下步骤快速启动并运行您的开发环境。

### 步骤 1: 克隆项目

```bash
git clone https://github.com/dittofeed/dittofeed.git
cd dittofeed
```

### 步骤 2: 安装依赖

```bash
yarn install
```

### 步骤 3: 配置环境变量

项目使用 `.env` 文件管理环境变量。您可以从模板文件开始：

```bash
cp .env.example .env
```
您可以根据需要修改 `.env` 文件中的配置。

### 步骤 4: 初始化并启动环境

首次搭建环境或需要清空并重置数据库时，请运行 `bootstrap` 命令。此命令会启动所有必需的基础设施服务，并执行数据库初始化和迁移。

```bash
./dev-start.sh bootstrap
```

### 步骤 5: 日常开发启动

在日常开发中，使用 `all` 命令一键启动所有服务（基础设施 + 应用服务）。此命令会检查服务状态，确保它们正在运行，但不会重新初始化数据库。

```bash
./dev-start.sh all
```

所有应用服务（API, Dashboard, Worker）将以热加载模式启动，代码更改会实时反映出来。

## 3. 开发工作流程

### `dev-start.sh` 脚本详解

`dev-start.sh` 是管理本地开发环境的核心工具。

*   `./dev-start.sh bootstrap`: **【仅首次或重置时使用】** 启动基础设施并初始化数据库。
*   `./dev-start.sh all`: **【日常开发使用】** 检查并启动所有服务（基础设施+应用）。
*   `./dev-start.sh apps`: 仅并行启动所有应用服务（API, Dashboard, Worker）。
*   `./dev-start.sh infra`: 仅启动 Docker 中的基础设施服务。
*   `./dev-start.sh stop`: 停止由脚本启动的应用服务和 Docker 容器。
*   `./dev-start.sh help`: 显示帮助信息。

### 访问服务

*   **Dashboard**: `http://localhost:3000`
*   **API**: `http://localhost:3001`
*   **PostgreSQL**: `localhost:5432`
*   **ClickHouse**: `localhost:8123` (HTTP), `localhost:9000` (Native)
*   **Temporal UI**: `http://localhost:8080` (需使用特定 profile 启动)

## 4. VSCode 集成

项目已预先配置好 VSCode 调试和任务，以提升开发体验。

### 调试配置

直接在 "Run and Debug" 面板选择并启动以下任一配置：

*   `Debug API Server`
*   `Debug Dashboard`
*   `Debug Worker`

### 任务配置

使用 `Ctrl+Shift+P` -> `Tasks: Run Task` 可以快速执行预设任务，例如 `Build: All`。

## 5. 高级用法

### Docker Compose Profiles

`docker-compose.yaml` 文件定义了多个 profiles，允许您按需启动额外的辅助服务。您可以通过修改 `.env` 文件中的 `COMPOSE_PROFILES` 变量来启用它们。

例如，要同时启动 Temporal UI 和邮件服务器，可以设置：
`COMPOSE_PROFILES=temporal-ui,smtp`

可用的 profiles 包括：
*   `temporal-ui`: Temporal Web UI (访问 `http://localhost:8080`)
*   `otel`: OpenTelemetry 相关服务 (用于可观测性)
*   `smtp`: 邮件服务器 (MailHog，访问 `http://localhost:8025`)
*   `blob-storage`: 本地对象存储 (MinIO)

### 数据库管理

数据库连接信息位于 `.env` 文件中。

*   **重新初始化数据库**: `./dev-start.sh bootstrap`
*   **手动运行迁移**: `yarn admin bootstrap`

## 6. 常见问题与故障排除

*   **端口冲突**: 如果 `3000`, `3001`, `5432` 等端口被占用，请停止占用端口的进程，或修改 `.env` 和 `docker-compose.yaml` 中的端口配置。
*   **Docker 服务启动失败**:
    *   确保 Docker Desktop 正在运行。
    *   运行 `docker-compose ps` 查看服务状态。
    *   运行 `docker-compose logs <service-name>` 查看特定服务的日志。
*   **依赖安装失败**:
    *   尝试清理缓存并重新安装: `yarn cache clean && rm -rf node_modules && yarn install`
*   **TypeScript 编译错误**:
    *   尝试重新构建所有包: `yarn workspaces foreach run build`
*   **脚本权限问题**:
    *   如果 `./dev-start.sh` 无法执行, 请添加执行权限: `chmod +x dev-start.sh`

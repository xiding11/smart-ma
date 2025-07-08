#!/bin/bash

# Dittofeed 开发环境启动脚本
set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 加载环境变量
load_env() {
    if [ -f .env ]; then
        log_info "加载 .env 文件中的环境变量..."
        set -o allexport
        # shellcheck source=/dev/null
        source .env
        set +o allexport
    else
        log_warning ".env 文件未找到，将使用默认或已设置的环境变量。"
    fi
}

# 检查基础服务状态
check_infrastructure() {
    log_info "检查基础服务状态..."

    if ! docker-compose ps postgres | grep -q "Up"; then
        log_warning "PostgreSQL 未运行，正在启动..."
        docker-compose up -d postgres
    else
        log_success "PostgreSQL 已运行"
    fi

    if ! docker-compose ps temporal | grep -q "Up"; then
        log_warning "Temporal 未运行，正在启动..."
        docker-compose up -d temporal
    else
        log_success "Temporal 已运行"
    fi

    if ! docker-compose ps clickhouse-server | grep -q "Up"; then
        log_warning "ClickHouse 未运行，正在启动..."
        docker-compose up -d clickhouse-server
    else
        log_success "ClickHouse 已运行"
    fi

    log_info "等待服务启动..."
    sleep 5
}

# 检查数据库连接
check_database() {
    log_info "检查数据库连接..."

    # 等待PostgreSQL
    while ! docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
        log_info "等待 PostgreSQL 启动..."
        sleep 2
    done
    log_success "PostgreSQL 连接成功"

    # 等待ClickHouse
    while ! curl -s http://localhost:8123/ping >/dev/null 2>&1; do
        log_info "等待 ClickHouse 启动..."
        sleep 2
    done
    log_success "ClickHouse 连接成功"
}

# 运行数据库初始化
bootstrap_database() {
    log_info "运行数据库初始化..."

    if yarn admin bootstrap; then
        log_success "数据库初始化完成"
    else
        log_error "数据库初始化失败"
        exit 1
    fi
}

# 主函数
main() {
    log_info "启动 Dittofeed 开发环境..."
    load_env

    case "${1:-all}" in
    "infra" | "infrastructure")
        check_infrastructure
        check_database
        log_success "基础设施启动完成"
        ;;
    "bootstrap")
        check_infrastructure
        check_database
        bootstrap_database
        ;;
    "api")
        log_info "启动 API 服务..."
        yarn workspace api dev
        ;;
    "dashboard")
        log_info "启动 Dashboard 服务..."
        yarn workspace dashboard dev
        ;;
    "worker")
        log_info "启动 Worker 服务..."
        yarn workspace worker dev
        ;;
    "apps")
        log_info "启动所有应用服务 (API, Dashboard, Worker)..."
        yarn dev:apps
        ;;
    "all")
        check_infrastructure
        check_database
        log_info "准备启动所有应用服务..."
        main "apps"
        ;;
    "help" | "-h" | "--help")
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  all            启动所有基础服务和所有应用服务（默认）"
        echo "  infra          仅启动基础设施服务 (Postgres, Temporal, ClickHouse)"
        echo "  bootstrap      启动基础设施并运行数据库初始化（首次设置时使用）"
        echo "  apps           并行启动所有应用服务 (API, Dashboard, Worker)"
        echo "  api            启动 API 服务"
        echo "  dashboard      启动 Dashboard 服务"
        echo "  worker         启动 Worker 服务"
        echo "  help           显示此帮助信息"
        ;;
    *)
        log_error "未知选项: $1"
        log_info "使用 '$0 help' 查看可用选项"
        exit 1
        ;;
    esac
}

# 执行主函数
main "$@"

# 🚀 Dittofeed 开发环境快速启动

## 一键启动

```bash
# 克隆项目
git clone <repository-url>
cd dittofeed

# 安装依赖
yarn install

# 启动开发环境（包括基础服务和数据库初始化）
./dev-start.sh

# 启动应用服务（需要新的终端窗口）
./dev-start.sh api      # API 服务 (端口 3001)
./dev-start.sh dashboard # 前端界面 (端口 3000)
./dev-start.sh worker    # 后台任务 (端口 不对外暴露)
```

## 访问应用

- 🌐 **Dashboard**: http://localhost:3000
- 🔧 **API**: http://localhost:3001
- 📊 **Temporal UI** (可选): http://localhost:8080

## VSCode 调试

1. 安装推荐扩展
2. 按 `F5` 启动调试
3. 或使用任务面板 (`Ctrl+Shift+P` -> `Tasks: Run Task`)

## 服务状态检查

```bash
# 检查 Docker 服务
docker-compose ps

# 检查应用日志
./dev-start.sh help
```

📖 详细文档请查看 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

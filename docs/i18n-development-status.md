# Dittofeed Dashboard 国际化 (i18n) 开发状态报告

## 概述

本文档记录了 Dittofeed Dashboard 项目国际化功能的开发进度、已完成的功能、技术架构以及后续开发计划。

## 当前实现状态

### ✅ 已完成功能

#### 1. 基础架构设置
- **Next.js Pages Router i18n 配置**
  - 在 `next.config.js` 中配置了 `i18n` 支持
  - 支持语言：英语 (en)、中文 (zh)
  - 默认语言：中文 (zh)
  - 路由格式：`/dashboard/[locale]/[page]`

#### 2. 翻译基础设施
- **翻译文件结构**
  - 位置：`packages/dashboard/messages/`
  - 文件：`en.json`、`zh.json`
  - 格式：嵌套 JSON 结构，支持命名空间

#### 3. 翻译工具函数
- **自定义翻译钩子**
  - 实现了 `useSimpleTranslations()` 函数
  - 支持服务器端渲染 (SSR)
  - 提供回退机制，避免翻译缺失时的错误

#### 4. 已翻译组件
- **页面头部组件** (`HeaderContent`)
  - Git 分支选择器：主分支、你的分支、新建分支等
  - Git 操作按钮：操作、提交并推送、打开拉取请求等
  - GitHub 仓库链接提示文字

- **广播页面** (`broadcasts.page.tsx`)
  - 页面标题：Broadcasts → 广播

#### 5. 语言切换功能
- **语言切换组件** (`LanguageSwitcher.tsx`)
  - 支持在英文和中文之间切换
  - 使用 Next.js 标准路由切换
  - 可以集成到任何页面组件中

### 🔧 技术架构

#### 1. 路由架构
```
/dashboard/en/[page]  # 英文路由
/dashboard/zh/[page]  # 中文路由
/dashboard/[page]     # 自动重定向到默认语言 (zh)
```

#### 2. 翻译文件结构
```json
{
  "ComponentName": {
    "SubSection": {
      "key": "翻译文本"
    }
  }
}
```

#### 3. 翻译函数使用方法
```typescript
// 在组件中使用
const t = useSimpleTranslations('ComponentName');
const text = t('SubSection.key');
```

## 📁 文件结构

```
packages/dashboard/
├── src/
│   ├── components/
│   │   ├── LanguageSwitcher.tsx          # 语言切换组件
│   │   └── layout/header/
│   │       └── headerContent.tsx         # 已翻译的头部组件
│   ├── pages/
│   │   ├── _app.page.tsx                 # 应用根组件，包含 IntlProvider
│   │   ├── broadcasts.page.tsx           # 已翻译的广播页面
│   │   └── [其他页面]                    # 待翻译
│   └── [其他源码]
├── messages/
│   ├── en.json                           # 英文翻译
│   └── zh.json                           # 中文翻译
└── next.config.js                        # Next.js i18n 配置
```

## 📊 翻译覆盖率

### 已翻译 (约 5%)
- ✅ 页面头部组件 (HeaderContent)
- ✅ 广播页面标题
- ✅ Git 相关操作文本

### 待翻译 (约 95%)
- ❌ 旅程 (Journeys) 页面
- ❌ 用户分群 (Segments) 页面
- ❌ 模板 (Templates) 页面
- ❌ 用户属性 (User Properties) 页面
- ❌ 设置 (Settings) 页面
- ❌ 表单和按钮文本
- ❌ 错误消息和提示文本
- ❌ 导航菜单
- ❌ 对话框和模态框
- ❌ 数据表格headers

## 🚀 后续开发计划

### 第一阶段：核心页面翻译
**优先级：高**
1. **导航菜单翻译**
   - 侧边栏菜单项
   - 面包屑导航
   
2. **旅程页面翻译**
   - 旅程列表页面
   - 旅程编辑器
   - 节点类型和操作

3. **用户分群页面翻译**
   - 分群列表
   - 分群编辑器
   - 筛选条件

### 第二阶段：交互组件翻译
**优先级：中**
1. **表单组件**
   - 输入框标签
   - 验证错误消息
   - 帮助文本

2. **按钮和操作**
   - 操作按钮
   - 确认对话框
   - 成功/错误提示

### 第三阶段：完善和优化
**优先级：低**
1. **复杂文本处理**
   - 日期时间格式化
   - 数字格式化
   - 复数形式处理

2. **动态内容翻译**
   - 用户生成内容
   - 动态消息模板

## 🛠️ 开发指南

### 为新组件添加翻译

#### 1. 更新翻译文件
在 `messages/en.json` 和 `messages/zh.json` 中添加翻译键：

```json
{
  "NewComponent": {
    "title": "Title Text",
    "description": "Description Text"
  }
}
```

#### 2. 在组件中使用翻译
```typescript
import { useSimpleTranslations } from '../path/to/translation/utils';

function NewComponent() {
  const t = useSimpleTranslations('NewComponent');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

#### 3. 更新翻译工具函数
在 `headerContent.tsx` 中的 `useSimpleTranslations` 函数中添加新的翻译映射：

```typescript
const translations: Record<string, Record<string, string>> = {
  // ... 现有翻译
  'NewComponent': {
    title: isZh ? '中文标题' : 'English Title',
    description: isZh ? '中文描述' : 'English Description',
  },
};
```

### 最佳实践

1. **翻译键命名规范**
   - 使用 PascalCase 命名组件
   - 使用 camelCase 命名具体键
   - 结构：`ComponentName.section.key`

2. **翻译文本规范**
   - 保持简洁明了
   - 考虑文本长度差异
   - 避免硬编码格式

3. **测试建议**
   - 在两种语言下测试所有功能
   - 检查文本是否适合 UI 容器
   - 验证特殊字符显示正确

## 🔍 已知问题和解决方案

### 1. 服务器端渲染问题
**问题**：使用 `next-intl` 时出现 `ENVIRONMENT_FALLBACK` 错误
**解决方案**：实现了自定义的 `useSimpleTranslations` 钩子，避免了 SSR 问题

### 2. 动态导入路径问题
**问题**：动态导入翻译文件时路径解析错误
**解决方案**：改用静态翻译映射，提高性能和稳定性

### 3. 翻译文件维护
**问题**：翻译文件可能不同步
**解决方案**：建议使用 TypeScript 接口约束翻译文件结构

## 📈 性能考虑

1. **翻译文件大小**
   - 当前翻译文件很小，加载快速
   - 后续可考虑按页面拆分翻译文件

2. **运行时性能**
   - 使用内存中的翻译映射，查找速度快
   - 避免了异步翻译加载的延迟

## 🤝 贡献指南

1. **添加新翻译**
   - 同时更新英文和中文翻译文件
   - 遵循现有的命名规范
   - 测试两种语言的显示效果

2. **代码审查要点**
   - 检查翻译键是否正确
   - 验证中英文文本质量
   - 确保UI适配不同长度的文本

## 📞 联系信息

如有问题或建议，请联系项目维护团队或在项目仓库中提交 Issue。

---

*最后更新：2025-01-11*
*版本：v1.0*
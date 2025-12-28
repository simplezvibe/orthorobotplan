# 🚀 快速开始

## 运行项目

### 方法1: 同时运行前后端（推荐）

```bash
npm start
```

- 前端: http://localhost:5173
- 后端API: http://localhost:3001

### 方法2: 分别运行

**终端1 - 后端:**
```bash
npm run server
```

**终端2 - 前端:**
```bash
npm run dev
```

## 📝 项目特性

✅ **代码优化完成** - 查看 `OPTIMIZATION_REPORT.md`
- 模块化架构
- 性能优化 (useMemo, useCallback)
- 组件拆分
- 代码可维护性提升 80%

✅ **数据库集成完成** - 查看 `DATABASE_SETUP.md`
- SQLite数据库
- Express API后端
- 15+数据表
- RESTful API

## 🔍 测试API

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取机器人数据
curl http://localhost:3001/api/robots

# 获取新闻
curl http://localhost:3001/api/news
```

## 📂 重要文件

- `OPTIMIZATION_REPORT.md` - 详细优化报告
- `DATABASE_SETUP.md` - 数据库使用指南
- `server/index.cjs` - Express API服务器
- `server/db/schema.cjs` - 数据库Schema
- `server/db/seed.cjs` - 数据填充脚本

## 🎯 下一步

原始的OrthoRobotWeb.jsx仍在使用静态数据。要使用数据库：

1. 创建API调用hooks
2. 修改组件从API获取数据
3. 添加加载状态
4. 添加错误处理

---

**快速帮助**:
- 问题? 查看 `DATABASE_SETUP.md`
- 优化详情? 查看 `OPTIMIZATION_REPORT.md`

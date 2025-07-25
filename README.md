# kc-monitor

一个全面的性能与异常监控系统，实现前端应用的数据收集、处理和可视化展示功能。

## 项目介绍

本项目是一个现代化的前端监控解决方案，用于收集、分析和展示Web应用的性能指标和错误信息，帮助开发者提升应用质量和用户体验。

## 项目架构

项目采用Monorepo结构，使用pnpm workspace和lerna进行包管理：

### 核心包

- **@kc-monitor/core**: 提供基础API，包括Event、Transport、Client、Hub等核心功能，无平台依赖
- **@kc-monitor/browser**: JS平台SDK，实现BrowserClient、默认集成transport、错误/性能采集
- **@kc-monitor/react**: React平台SDK，集成ErrorBoundary、React Profiler等React特定功能

### 应用

- **@kc-monitor/backend**: 后端服务，负责接收和处理前端上报的数据
- **@kc-monitor/dashboard**: 前端控制台，用于数据可视化展示和监控管理
- **@kc-monitor/email-renderer**: 邮件渲染服务，用于告警通知

### 模板

- **react-template**: React应用集成示例

## 功能特性

- **错误监控**: 自动捕获和上报JavaScript运行时错误和未处理的Promise异常
- **性能监控**: 收集关键性能指标，如页面加载时间、React组件渲染性能等
- **自定义事件**: 支持上报自定义事件和指标
- **数据可视化**: 通过Dashboard直观展示监控数据和趋势
- **多框架支持**: 提供React专用集成，未来可扩展到其他框架

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 构建SDK

```bash
pnpm run build:sdk
```

### 启动后端服务

```bash
pnpm run dev:backend
```

### 启动Dashboard

```bash
pnpm run dev:dashboard
```

## 许可证

[ISC](LICENSE)

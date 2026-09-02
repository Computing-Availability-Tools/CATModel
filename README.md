# CATModel

> 集群可靠性建模分析工具集，提供失效率转换、可用度计算等 Web 化工具。

| 项目 | 说明 |
|------|------|
| 版本号 | v0.1.0 |
| 许可证 | Apache-2.0 |

## 概述

CATModel 是一个纯前端的可靠性分析 Web 工具集，面向集群 MTBF 和训练/推理业务可用度的量化评估。所有计算在浏览器本地完成，无需后端服务。

## 工具列表

| 工具 | 说明 |
|------|------|
| [失效率转换](tools/failure-rate/) | PPM、MTBF、FIT 失效率单位的互相转换 |
| [传统可用度计算](tools/availability/) | A = MTBF / (MTBF + MTTR) |
| [训练可用度计算](tools/training-availability/) | 基于检查点容错模型的计算 |

## 快速开始

直接在浏览器中打开 `index.html` 即可使用，无需安装任何依赖。

```bash
# 方式一：直接打开
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# 方式二：使用 HTTP 服务（推荐）
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 功能特性

### 失效率转换工具

支持 FIT、MTBF、PPM 三种失效率单位的互相转换，可自定义年运行小时数。

### 传统可用度计算

基于公式 `A = MTBF / (MTBF + MTTR)` 计算系统可用度，输出包括：
- 可用度数值及百分比
- 可用度等级（如"三个9"、"五个9"）
- 年停机时间估算

### 训练可用度计算

基于检查点容错模型，公式：

```
A = T_ckpt / (T_ckpt + T_overhead + (T_ckpt/2 + MTTR_eff) × (e^(T_ckpt/MTBF) - 1))
```

其中 `MTTR_eff = MTTR_auto × auto_recovery_rate + MTTR_manual × (1 - auto_recovery_rate)`

### 计算记录管理

所有工具均支持：
- 保存计算记录到浏览器本地存储
- 加载历史计算记录
- 导出/导入 JSON 文件备份

## 技术栈

- 纯前端：HTML + CSS + JavaScript
- 零依赖，无需构建工具
- 浏览器 localStorage 存储

## 目录结构

```
CATModel/
├── index.html              # 主入口
├── css/style.css           # 全局样式
├── js/
│   ├── app.js              # 通用逻辑
│   ├── storage.js          # 存储管理
│   ├── converters.js       # 数值转换
│   └── calculators.js      # 核心计算引擎
├── tools/
│   ├── failure-rate/       # 失效率转换
│   ├── availability/       # 传统可用度
│   └── training-availability/  # 训练可用度
├── DESIGN.md               # 设计文档
└── README.md
```

## 许可证

Apache License 2.0

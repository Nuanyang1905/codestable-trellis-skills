# CodeStable × Trellis 技能包

将 [CodeStable](https://github.com/liuzhengdongfortest/CodeStable) 的方法论融入 [Trellis](https://github.com/mindfold-ai/Trellis) 基础设施，补齐 Trellis 工作流中"设计 → 验收 → 知识沉淀"三个缺口。

## 为什么需要这个

Trellis 原生的流程是 `brainstorm → PRD → implement → check`。中间缺了一个关键环节：**写代码之前，先把要做什么想清楚，用大白话写下来让人确认**。

这个技能包在 PRD 和写代码之间插入一个设计阶段，让不会编程的人也能在 AI 动手前把关。

## 工作流对比

```
Trellis 原生：  brainstorm → PRD → 写代码 → check(代码质量)
加上这个包：    brainstorm → PRD → 📐设计 → 写代码 → ✅验收+检查 → 📝沉淀经验
```

## 包含的 Skill

### 1. trellis-feat-design（新增 — 核心）

在 PRD 确认后、AI 写代码前，产出一份**人看得懂的设计文档**：

- 现状 vs 变化（用行为描述，不写技术术语）
- 哪些地方会被影响（挂载点）
- 怎么算做对了（可观察的成功标准）
- 明确不做什么
- 边界和出错时怎么办

产出 `design.md` + `checklist.yaml`。用户确认后 AI 才动手写代码。

### 2. trellis-check（增强）

原有功能：代码质量检查（lint / typecheck / test）。
新增功能：**先做设计验收**。有 design.md 时，先对照 checklist 逐条核对实现，前端改动必须浏览器跑过，再写入 `acceptance.md` 验收报告。

### 3. trellis-update-spec（增强）

原有功能：把新发现写进 spec。
新增功能：
- **坑点/好做法双轨沉淀**：踩过的坑和发现的更好的做法分开记录
- **查重防重复**：写之前先搜已有记录，重叠就更新旧文档不新建
- **主动提醒**：任务完成后主动问"有值得记下来的吗？"

## 安装

```bash
# 一行安装
npx github:Nuanyang1905/codestable-trellis-skills
```

前提：当前目录已经跑过 `trellis init -u your-name`。

## 用法

安装后直接说人话触发：

| 你说 | AI 做 |
|------|------|
| "开始设计方案" | 读 PRD → 写你看得懂的 design.md → 等你确认 |
| "检查一下代码" | 先对照 design 验收 → 再做代码质量检查 |
| "把这个坑记下来" | 分类（坑点/好做法）→ 查重 → 沉淀到 spec |

## 许可

AGPL-3.0 — 基于 [CodeStable](https://github.com/liuzhengdongfortest/CodeStable)（MIT）的方法论，运行在 [Trellis](https://github.com/mindfold-ai/Trellis)（AGPL-3.0）框架之上。

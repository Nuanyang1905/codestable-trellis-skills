---
name: trellis-check
description: "Comprehensive quality verification: design acceptance (when design.md exists), spec compliance, lint, type-check, tests, cross-layer data flow, code reuse, and consistency checks. Use when code is written and needs quality verification, before committing changes, or to catch context drift during long sessions."
---

# Code Quality Check

Comprehensive quality verification for recently written code. Combines design acceptance, spec compliance, cross-layer safety, and pre-commit checks.

---

## Step 0: Design Acceptance (if design.md exists)

Before running code quality checks, check if a design document exists for the current task. If `design.md` + `checklist.yaml` exist, perform design acceptance FIRST.

### 0.1 Locate Design Artifacts

先尝试用 task.py 获取当前活跃 task：

```bash
python ./.trellis/scripts/task.py current --source 2>/dev/null
```

**Fallback**：如果上述命令无输出（没有活跃 session 或 task.py 不可用），用以下方式查找：

```bash
# 找最近修改的非 archive task 目录
ls -lt .trellis/tasks/ | grep "^d" | grep -v archive | head -3
```

对每个候选目录检查是否存在 `design.md` + `checklist.yaml`。存在即采用，不存在则继续查下一个。

If there is an active task (or fallback found one), look for:
- `.trellis/tasks/{task}/design.md`
- `.trellis/tasks/{task}/checklist.yaml`

If neither exists after trying all candidates, skip to Step 1 (standard code quality check).

### 0.2 Run Design Acceptance

Read `design.md` and `checklist.yaml`. For each check item in checklist.yaml, verify and report:

```
逐条验收报告：

## 验收场景核对
- [ ] S1: {场景描述} → 验证方式：{浏览器实测/代码检查} → 结果：通过/未通过
  - 通过证据：{用户能看到什么、实际行为是什么}
  - 未通过原因：{具体哪里不对}

## 边界与错误场景
- [ ] E1: {边界场景} → 验证方式：{模拟断网/空数据/冲突} → 结果：通过/未通过

## 反向核对（确保没多做）
- [ ] REV-1: {明确不做的事项} → 验证方式：grep/代码审查 → 结果：通过/未通过
```

**挂载点反向核对（必须实际 grep + 沙盘推演）**：

对 design.md 第 2.3 节的每个挂载点：
```bash
grep -rn "<挂载点关键词>" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.py" --include="*.go" src/ app/ lib/ 2>/dev/null
```

沙盘推演：假设删掉这个挂载点对应的代码 → feature 在用户视角是否消失了？
- 是 → 挂载点正确，继续
- 否 → 挂载点遗漏或多列，修正 design.md 或补充遗漏的挂载点

**验收原则**：
- 发现偏差 → **先修代码**，不是只在报告里记一笔
- 前端改动必须浏览器肉眼验证，typecheck 通过不代表用户用起来对
- 反向核对必须实际 grep + 沙盘推演，不能凭印象勾选

### 0.3 Write Acceptance Report

验收完成后，写入 `.trellis/tasks/{task}/acceptance.md`：

```markdown
# {功能名称} 验收报告
> 验收日期：YYYY-MM-DD | 关联设计：design.md

## 验收结果汇总
- 正常场景：{N}/{M} 通过
- 边界场景：{N}/{M} 通过
- 反向核对：{N}/{M} 通过
- 架构归并：{完成/跳过}（{具体说明}）

## 逐条结果
{上面的逐条核对结果}

## 架构归并
{0.5 节的归并结果}
- [ ] 架构文档 X（{路径}）：归并内容 {描述}；已写入 / 不需要（理由）
- [ ] 架构总入口更新：已处理 / 不需要
**判据验证**：没读过 design 的人打开 architecture 能知道系统里现在有这个能力。

## 遗留
{未通过的项、原因、后续计划}
```

### 0.4 Update Checklist Status

把 `checklist.yaml` 中所有 `checks` 的状态更新：通过 → `passed`，未通过 → `failed`。

All checks passed → 报告完成，继续 Step 0.5（架构归并）。
有 failed → 先修代码，修完后重新跑 Step 0，直到全部 passed。

---

### 0.5 Architecture Merge-Back（架构归并）

验收通过后、代码质量检查前，把本次 feature 中稳定、系统级可见的内容**实际写入**架构文档。不是加个 design 链接就算数——没读过 design 的人打开 architecture 应该能知道"系统里现在有这个能力、大致形态、交互约束"。

#### 0.5.1 判断是否需要归并

检查 design.md 中是否涉及以下内容（一般在 design 的第 4 节或"影响范围"段落）：
- 新增模块/子系统
- 新增或修改的接口/数据契约
- 跨模块的流程或编排变化
- 新的流程级约束（错误语义、幂等性、并发、扩展点）

没有则跳过，写"本次无架构维度变更"并继续 Step 1。

#### 0.5.2 三类归并

**名词归并**（新增/变化的实体、类型、对外契约）：
```bash
# 找到相关 spec 文件
ls .trellis/spec/<package>/
```
把 design 中定义的新实体、接口签名、数据结构写入对应的 spec 文件。

**动词骨架归并**（跨模块可见的主流程/关键编排）：
- 技术角色 design 在第 2.2 节有编排图/流程图 → 把图中新增的模块交互关系写入架构文档的结构图或模块交互节
- 非技术角色 design 无流程图 → 从挂载点（第 2.3 节）和推进顺序（第 2.4 节）反推受影响的功能区域，写入架构文档

**流程级约束归并**（跨 feature 稳定的约束）：
design 中声明的幂等性要求、并发限制、错误语义等，写入架构文档的"已知约束"节。

#### 0.5.3 写入规范

```
逐项核对：
- [ ] 架构文档 {路径}：归并内容 {描述}；已写入 / 不需要（理由：{具体}）
- [ ] 架构总入口是否需要新增描述
```

**判据**：归并完成后，没读过 design 的人打开 architecture 应该知道"系统里现在有这个能力"。

#### 0.5.4 写入 acceptance.md

归并结果写入验收报告第 5 节（见 0.3 模板中追加的第 5 节）。

---

## Step 1: Identify What Changed

```bash
git diff --name-only HEAD
git status
```

## Step 2: Read Applicable Specs

```bash
python ./.trellis/scripts/get_context.py --mode packages
```

For each changed package/layer, read the spec index and follow its **Quality Check** section:

```bash
cat .trellis/spec/<package>/<layer>/index.md
```

Read the specific guideline files referenced — the index is a pointer, not the goal.

## Step 3: Run Project Checks

Run the project's lint, type-check, and test commands. Fix any failures before proceeding.

## Step 4: Review Against Checklist

### Code Quality

- [ ] Linter passes?
- [ ] Type checker passes (if applicable)?
- [ ] Tests pass?
- [ ] No debug logging left in?
- [ ] No suppressed warnings or type-safety bypasses?

### Test Coverage

- [ ] New function → unit test added?
- [ ] Bug fix → regression test added?
- [ ] Changed behavior → existing tests updated?

### Spec Sync

- [ ] Does `.trellis/spec/` need updates?
  - **踩坑经验/好做法** → 提醒用户走 `trellis-compound`
  - **编码规范/接口契约变更** → 提醒用户走 `trellis-update-spec`
  - 纯粹实现细节 → 跳过

## Step 5: Cross-Layer Dimensions (if applicable)

Skip this step if your change is confined to a single layer.

### A. Data Flow (changes touch 3+ layers)

- [ ] Read flow traces correctly: Storage → Service → API → UI
- [ ] Write flow traces correctly: UI → API → Service → Storage
- [ ] Types/schemas correctly passed between layers?
- [ ] Errors properly propagated to caller?

### B. Code Reuse (modifying constants, creating utilities)

- [ ] Searched for existing similar code before creating new?
  ```bash
  grep -r "pattern" src/
  ```
- [ ] If 2+ places define same value → extracted to shared constant?
- [ ] After batch modification, all occurrences updated?

### C. Import/Dependency (creating new files)

- [ ] Correct import paths (relative vs absolute)?
- [ ] No circular dependencies?

### D. Same-Layer Consistency

- [ ] Other places using the same concept are consistent?

---

## Step 6: Report and Fix

Report violations found and fix them directly. Re-run project checks after fixes.

完成后问一句：**"这次有没有踩坑或发现好做法值得记下来？"** 用户说"有" → 走 `trellis-compound`；说"不用" → 跳过。

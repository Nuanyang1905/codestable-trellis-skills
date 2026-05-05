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

```bash
python ./.trellis/scripts/task.py current --source 2>/dev/null
```

If there is an active task, look for:
- `.trellis/tasks/{task}/design.md`
- `.trellis/tasks/{task}/checklist.yaml`

If neither exists, skip to Step 1 (standard code quality check).

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

**验收原则**：
- 发现偏差 → **先修代码**，不是只在报告里记一笔
- 前端改动必须浏览器肉眼验证，typecheck 通过不代表用户用起来对
- 反向核对必须实际 grep，不能凭印象勾选

### 0.3 Write Acceptance Report

验收完成后，写入 `.trellis/tasks/{task}/acceptance.md`：

```markdown
# {功能名称} 验收报告
> 验收日期：YYYY-MM-DD | 关联设计：design.md

## 验收结果汇总
- 正常场景：{N}/{M} 通过
- 边界场景：{N}/{M} 通过
- 反向核对：{N}/{M} 通过

## 逐条结果
{上面的逐条核对结果}

## 遗留
{未通过的项、原因、后续计划}
```

### 0.4 Update Checklist Status

把 `checklist.yaml` 中所有 `checks` 的状态更新：通过 → `passed`，未通过 → `failed`。

All checks passed → 报告完成，继续 Step 1（代码质量检查）。
有 failed → 先修代码，修完后重新跑 Step 0，直到全部 passed。

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

- [ ] Does `.trellis/spec/` need updates? (new patterns, conventions, lessons learned)

> "If I fixed a bug or discovered something non-obvious, should I document it so future me won't hit the same issue?" → If YES, update the relevant spec doc.

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

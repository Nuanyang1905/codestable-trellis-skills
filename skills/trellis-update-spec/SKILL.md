---
name: trellis-update-spec
description: "Captures executable contracts and coding conventions into .trellis/spec/ documents. Use when learning something valuable from debugging, implementing, or discussion that should be preserved for future sessions."
---

# Update Code-Spec - Capture Executable Contracts

When you learn something valuable (from debugging, implementing, or discussion), use this to update the relevant code-spec documents.

**Timing**: After completing a task, fixing a bug, or discovering a new pattern

---

## Knowledge Compound（知识沉淀 — 优先）

Spec 记录的是"怎么做"，**不记录"踩了什么坑"和"发现了什么更好的做法"**。没有沉淀的项目总在重复踩同一个坑。

在做 Code-Spec 更新之前，先判断这次学到的东西是否属于知识沉淀。

### 两条轨道

| 轨道 | 记录什么 | 示例 |
|------|---------|------|
| **坑点（pitfall）** | 调过的 bug / 绕过的配置陷阱 / 环境问题 / 集成失败 | "改了 A 文件的类型定义，B 文件的测试全部挂掉，因为 mock 数据没同步" |
| **好做法（knowledge）** | 最佳实践 / 工作流改进 / 可复用模式 | "表单验证应该在前端和后端各做一遍，只做一端会漏" |

### 沉淀流程

#### Step K1：识别
从对话上下文提取：
- 来源：feature 工作流 / bug 修复 / 独立发现
- 粗分轨道：坑点 or 好做法。两者都有就分两条

#### Step K2：查重（必做）
在 `.trellis/spec/` 下搜索是否已有类似记录：
```bash
grep -r "<关键词>" .trellis/spec/
```

发现重叠时：
- 内容需要补充 → **更新旧文档**，在末尾加 `> 更新于 YYYY-MM-DD：{新增内容}`
- 内容已被覆盖 → 不重复写，告诉用户"这条已记录在 {路径}"
- 内容冲突 → 列出来让用户裁决

#### Step K3：提炼（一次一个问题）
- 坑点：现象是什么 → 试过哪些解法没用 → 最终怎么发现的 → 下次怎么更早发现
- 好做法：在什么场景下有用 → 不这样做会出什么问题 → 有没有不适用的反例

用户对某问题说"没什么"就跳过，不硬填。

#### Step K4：起草 + 用户确认
一次性起草完整内容（YAML frontmatter + 正文），一次性展示给用户确认。

#### Step K5：落盘
写入 `.trellis/spec/guides/compound.md`（追加模式，每条新记录一个 `###` 小节）：

```markdown
### {日期} - {轨道：坑点/好做法} - {一句话标题}

**轨道**：坑点 / 好做法
**日期**：YYYY-MM-DD
**关联**：{相关 task/feature}

**现象/场景**：{描述}

**根因/原理**：{为什么}

**解法/做法**：{怎么做}

**下次怎么发现**：{预防措施}
```

#### Step K6：可发现性检查
写完检查 `AGENTS.md` 或 `.claude/` 下有没有指引 AI 查阅 compound 记录。没有就提示用户加一行——不自作主张。

---

## Code-Spec First Rule (CRITICAL)

In this project, "spec" for implementation work means **code-spec**:
- Executable contracts (not principle-only text)
- Concrete signatures, payload fields, env keys, and boundary behavior
- Testable validation/error behavior

If the change touches infra or cross-layer contracts, code-spec depth is mandatory.

### Mandatory Triggers

Apply code-spec depth when the change includes any of:
- New/changed command or API signature
- Cross-layer request/response contract change
- Database schema/migration change
- Infra integration (storage, queue, cache, secrets, env wiring)

### Mandatory Output (7 Sections)

For triggered tasks, include all sections below:
1. Scope / Trigger
2. Signatures (command/API/DB)
3. Contracts (request/response/env)
4. Validation & Error Matrix
5. Good/Base/Bad Cases
6. Tests Required (with assertion points)
7. Wrong vs Correct (at least one pair)

---

## When to Update

### Proactive Reminder（主动提醒）

以下时机**必须**主动提醒用户记录，用户说"不用"立刻跳过：

| 时机 | 提醒语 |
|------|--------|
| trellis-check 验收完成 | "这次开发中有没有踩到什么坑、或者发现什么好做法值得记下来？" |
| 修了一个非显而易见的 bug | "这个 bug 的根因和解决过程要不要沉淀一下？下次免得再踩。" |
| 用户说"终于搞定了/原来是这样" | "听起来是个值得记下来的发现，要记吗？" |

### Update Triggers

| Trigger | Example | Target |
|---------|---------|-------------|
| **Implemented a feature** | Added a new integration or module | Relevant spec file |
| **Made a design decision** | Chose extensibility pattern over simplicity | Relevant spec + "Design Decisions" section |
| **Fixed a bug** | Found a subtle issue with error handling | Relevant spec (e.g., error-handling docs) |
| **Discovered a pattern** | Found a better way to structure code | Relevant spec file |
| **Hit a gotcha** | Learned that X must be done before Y | Knowledge compound (坑点轨道) |
| **Established a convention** | Team agreed on naming pattern | Quality guidelines |
| **New thinking trigger** | "Don't forget to check X before doing Y" | `guides/*.md` (as a checklist item) |

**Key Insight**: Code-spec updates are NOT just for problems. Every feature implementation contains design decisions and contracts that future AI/developers need to execute safely.

---

## Spec Structure Overview

```
.trellis/spec/
├── <layer>/           # Per-layer coding standards (e.g., backend/, frontend/, api/)
│   ├── index.md       # Overview and links
│   └── *.md           # Topic-specific guidelines
└── guides/            # Thinking checklists (NOT coding specs!)
    ├── index.md       # Guide index
    └── *.md           # Topic-specific guides
```

### CRITICAL: Code-Spec vs Guide - Know the Difference

| Type | Location | Purpose | Content Style |
|------|----------|---------|---------------|
| **Code-Spec** | `<layer>/*.md` | Tell AI "how to implement safely" | Signatures, contracts, matrices, cases, test points |
| **Guide** | `guides/*.md` | Help AI "what to think about" | Checklists, questions, pointers to specs |

**Decision Rule**: Ask yourself:

- "This is **how to write** the code" → Put in a spec layer directory
- "This is **what to consider** before writing" → Put in `guides/`

**Example**:

| Learning | Wrong Location | Correct Location |
|----------|----------------|------------------|
| "Use API X not API Y for this task" | ❌ `guides/` (too specific for a thinking guide) | ✅ Relevant spec file (concrete convention) |
| "Remember to check X when doing Y" | ❌ Spec file (too abstract for a spec) | ✅ `guides/` (thinking checklist) |

**Guides should be short checklists that point to specs**, not duplicate the detailed rules.

---

## Update Process

### Step 1: Identify What You Learned

Answer these questions:

1. **What did you learn?** (Be specific)
2. **Why is it important?** (What problem does it prevent?)
3. **Where does it belong?** (Which spec file?)

### Step 2: Classify the Update Type

| Type | Description | Action |
|------|-------------|--------|
| **Design Decision** | Why we chose approach X over Y | Add to "Design Decisions" section |
| **Project Convention** | How we do X in this project | Add to relevant section with examples |
| **New Pattern** | A reusable approach discovered | Add to "Patterns" section |
| **Forbidden Pattern** | Something that causes problems | Add to "Anti-patterns" or "Don't" section |
| **Common Mistake** | Easy-to-make error | Add to "Common Mistakes" section |
| **Convention** | Agreed-upon standard | Add to relevant section |
| **Gotcha** | Non-obvious behavior | Add warning callout |

### Step 3: Read the Target Code-Spec

Before editing, read the current code-spec to:
- Understand existing structure
- Avoid duplicating content
- Find the right section for your update

```bash
cat .trellis/spec/<category>/<file>.md
```

### Step 4: Make the Update

Follow these principles:

1. **Be Specific**: Include concrete examples, not just abstract rules
2. **Explain Why**: State the problem this prevents
3. **Show Contracts**: Add signatures, payload fields, and error behavior
4. **Show Code**: Add code snippets for key patterns
5. **Keep it Short**: One concept per section

### Step 5: Update the Index (if needed)

If you added a new section or the code-spec status changed, update the category's `index.md`.

---

## Update Templates

### Mandatory Template for Infra/Cross-Layer Work

```markdown
## Scenario: <name>

### 1. Scope / Trigger
- Trigger: <why this requires code-spec depth>

### 2. Signatures
- Backend command/API/DB signature(s)

### 3. Contracts
- Request fields (name, type, constraints)
- Response fields (name, type, constraints)
- Environment keys (required/optional)

### 4. Validation & Error Matrix
- <condition> -> <error>

### 5. Good/Base/Bad Cases
- Good: ...
- Base: ...
- Bad: ...

### 6. Tests Required
- Unit/Integration/E2E with assertion points

### 7. Wrong vs Correct
#### Wrong
...
#### Correct
...
```

### Adding a Design Decision

```markdown
### Design Decision: [Decision Name]

**Context**: What problem were we solving?

**Options Considered**:
1. Option A - brief description
2. Option B - brief description

**Decision**: We chose Option X because...

**Example**:
\`\`\`typescript
// How it's implemented
code example
\`\`\`

**Extensibility**: How to extend this in the future...
```

### Adding a Project Convention

```markdown
### Convention: [Convention Name]

**What**: Brief description of the convention.

**Why**: Why we do it this way in this project.

**Example**:
\`\`\`typescript
// How to follow this convention
code example
\`\`\`

**Related**: Links to related conventions or specs.
```

### Adding a New Pattern

```markdown
### Pattern Name

**Problem**: What problem does this solve?

**Solution**: Brief description of the approach.

**Example**:
\`\`\`
// Good
code example

// Bad
code example
\`\`\`

**Why**: Explanation of why this works better.
```

### Adding a Forbidden Pattern

```markdown
### Don't: Pattern Name

**Problem**:
\`\`\`
// Don't do this
bad code example
\`\`\`

**Why it's bad**: Explanation of the issue.

**Instead**:
\`\`\`
// Do this instead
good code example
\`\`\`
```

### Adding a Common Mistake

```markdown
### Common Mistake: Description

**Symptom**: What goes wrong

**Cause**: Why this happens

**Fix**: How to correct it

**Prevention**: How to avoid it in the future
```

### Adding a Gotcha

```markdown
> **Warning**: Brief description of the non-obvious behavior.
>
> Details about when this happens and how to handle it.
```

---

## Interactive Mode

If you're unsure what to update, answer these prompts:

1. **What did you just finish?**
   - [ ] Fixed a bug
   - [ ] Implemented a feature
   - [ ] Refactored code
   - [ ] Had a discussion about approach

2. **What did you learn or decide?**
   - Design decision (why X over Y)
   - Project convention (how we do X)
   - Non-obvious behavior (gotcha)
   - Better approach (pattern)

3. **Would future AI/developers need to know this?**
   - To understand how the code works → Yes, update spec
   - To maintain or extend the feature → Yes, update spec
   - To avoid repeating mistakes → Yes, update spec
   - Purely one-off implementation detail → Maybe skip

4. **Which area does it relate to?**
   - [ ] Backend code
   - [ ] Frontend code
   - [ ] Cross-layer data flow
   - [ ] Code organization/reuse
   - [ ] Quality/testing

---

## Quality Checklist

Before finishing your code-spec update:

- [ ] Is the content specific and actionable?
- [ ] Did you include a code example?
- [ ] Did you explain WHY, not just WHAT?
- [ ] Did you include executable signatures/contracts?
- [ ] Did you include validation and error matrix?
- [ ] Did you include Good/Base/Bad cases?
- [ ] Did you include required tests with assertion points?
- [ ] Is it in the right code-spec file?
- [ ] Does it duplicate existing content?
- [ ] Would a new team member understand it?

---

## Relationship to Other Commands

```
Development Flow:
  Learn something → /trellis:update-spec → Knowledge captured
       ↑                                  ↓
  /trellis:break-loop ←──────────────────── Future sessions benefit
  (deep bug analysis)
```

- `/trellis:break-loop` - Analyzes bugs deeply, often reveals spec updates needed
- `/trellis:update-spec` - Actually makes the updates
- `/trellis:finish-work` - Reminds you to check if specs need updates

---

## Core Philosophy

> **Code-specs are living documents. Every debugging session, every "aha moment" is an opportunity to make the implementation contract clearer.**

The goal is **institutional memory**:
- What one person learns, everyone benefits from
- What AI learns in one session, persists to future sessions
- Mistakes become documented guardrails

# CodeStable × Trellis 技能包

将 CodeStable 方法论融入 Trellis 基础设施，补齐"设计 → 验收 → 知识沉淀"三个缺口。

## 包含的 Skill

| Skill | 做什么 |
|-------|--------|
| `trellis-feat-design` | PRD 和写代码之间的设计阶段。产出人看得懂的设计文档 + 验收清单 |
| `trellis-check` | 增强版：有设计文档时先做设计验收，再做代码质量检查 |
| `trellis-update-spec` | 增强版：坑点/好做法双轨知识沉淀，查重防重复，主动提醒记录 |

## 安装

```bash
# 一行安装（不需要先 clone）
npx codestable-trellis-skills
```

前提：当前目录已经跑过 `trellis init`。

## 用法

安装后直接说人话：

| 你说 | AI 做 |
|------|------|
| "开始设计方案" | 读 PRD → 写你能看懂的 design.md → 等你确认 |
| "检查一下代码" | 先对照 design 验收 → 再做代码质量检查 |
| "把这个坑记下来" | 坑点/好做法分类 → 查重 → 沉淀到 spec |

## 许可证

AGPL-3.0

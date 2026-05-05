#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const targetDir = path.join(process.cwd(), ".claude", "skills");
const sourceDir = path.join(__dirname, "..", "skills");

const skills = [
  "trellis-feat-design",
  "trellis-check",
  "trellis-update-spec",
  "trellis-compound",
];

console.log("  CodeStable × Trellis 技能包");
console.log("");

// Check if target looks like a Claude Code / Trellis project
if (!fs.existsSync(path.join(process.cwd(), ".claude"))) {
  console.log("⚠️  当前目录没有 .claude/，可能还没初始化 Trellis。");
  console.log("   请先运行: trellis init -u your-name");
  process.exit(1);
}

// Ensure skills directory exists
fs.mkdirSync(targetDir, { recursive: true });

let installed = 0;
let updated = 0;

for (const name of skills) {
  const src = path.join(sourceDir, name);
  const dest = path.join(targetDir, name);
  const existed = fs.existsSync(dest);

  // Copy recursively
  fs.cpSync(src, dest, { recursive: true });

  if (existed) {
    console.log(`  ✓ ${name} (已更新)`);
    updated++;
  } else {
    console.log(`  + ${name} (新安装)`);
    installed++;
  }
}

console.log("");
console.log(`完成！新增 ${installed} 个 skill，更新 ${updated} 个。`);
console.log("");
console.log("现在你可以用：");
console.log("  说「开始设计方案」→ trellis-feat-design");
console.log("  说「检查代码」   → trellis-check (含设计验收 + 架构归并)");
console.log("  说「记下来」     → trellis-compound (坑点/好做法双轨沉淀)");
console.log("  说「更新规范」   → trellis-update-spec (编码规范更新)");

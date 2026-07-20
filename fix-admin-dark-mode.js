const fs = require('fs');
const path = require('path');

const directoriesToSearch = [
  path.join(__dirname, 'src', 'app', 'admin', '(dashboard)'),
  path.join(__dirname, 'src', 'components')
];

function processFile(filePath) {
  if (filePath.includes('AdminSidebar.tsx') || filePath.includes('ThemeToggle.tsx') || filePath.includes('AdminArticleForm.tsx')) {
    // skip these as they might be partially done or are special
    if (filePath.includes('AdminSidebar.tsx') || filePath.includes('ThemeToggle.tsx')) return;
  }
  
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-white(?!\s*dark:bg-)/g, 'bg-white dark:bg-slate-800');
  content = content.replace(/bg-\[\#F8F7F4\](?!\s*dark:bg-)/g, 'bg-[#F8F7F4] dark:bg-slate-900/50');
  content = content.replace(/bg-\[\#FAF9F6\](?!\s*dark:bg-)/g, 'bg-[#FAF9F6] dark:bg-slate-900/80');
  content = content.replace(/bg-\[\#FCFBFA\](?!\s*dark:bg-)/g, 'bg-[#FCFBFA] dark:bg-slate-900/50');
  content = content.replace(/bg-stone-50(?!\s*dark:bg-)/g, 'bg-stone-50 dark:bg-slate-900/50');
  content = content.replace(/hover:bg-stone-50(?!\s*dark:hover:bg-)/g, 'hover:bg-stone-50 dark:hover:bg-slate-700/50');
  content = content.replace(/bg-stone-100(?!\s*dark:bg-)/g, 'bg-stone-100 dark:bg-slate-700');

  // Texts
  content = content.replace(/text-legal-navy(?!\s*dark:text-)/g, 'text-legal-navy dark:text-slate-100');
  content = content.replace(/text-on-surface-variant(?!\s*dark:text-)/g, 'text-on-surface-variant dark:text-slate-400');
  
  // Borders
  content = content.replace(/border-stone-gray\/60(?!\s*dark:border-)/g, 'border-stone-gray/60 dark:border-slate-700/60');
  content = content.replace(/border-stone-gray\/40(?!\s*dark:border-)/g, 'border-stone-gray/40 dark:border-slate-700/40');
  content = content.replace(/border-stone-gray\/20(?!\s*dark:border-)/g, 'border-stone-gray/20 dark:border-slate-700/20');
  content = content.replace(/border-\[\#DEDCD7\](?!\s*dark:border-)/g, 'border-[#DEDCD7] dark:border-slate-700/50');
  content = content.replace(/border-stone-gray(?!\s*dark:border-|\/)/g, 'border-stone-gray dark:border-slate-700');
  content = content.replace(/divide-stone-gray\/30(?!\s*dark:divide-)/g, 'divide-stone-gray/30 dark:divide-slate-700/50');

  // Input hovers
  content = content.replace(/hover:border-\[\#C4C1BA\](?!\s*dark:hover:border-)/g, 'hover:border-[#C4C1BA] dark:hover:border-slate-600');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (fullPath.includes('Admin') || dir.includes('admin')) {
        processFile(fullPath);
      }
    }
  }
}

directoriesToSearch.forEach(walkDir);
console.log('Done.');

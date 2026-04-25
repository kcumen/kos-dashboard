import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KOS_DIR = '/home/Kcumen/kos-framework';
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────────
function getDirectories(p) {
  return fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...vals] = line.split(':');
    if (key && vals.length) fm[key.trim()] = vals.join(':').trim();
  });
  return fm;
}

// ── API: Registry ────────────────────────────────────────────────────────────
app.get('/api/registry', (req, res) => {
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(KOS_DIR, '04-protocols/core/registry.json'), 'utf8'));
    res.json(registry);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: Products ─────────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(KOS_DIR, '04-protocols/core/registry.json'), 'utf8'));
    const products = registry.assets.filter(a => a.type === 'product');
    const result = products.map(p => {
      const assetPath = path.join(KOS_DIR, p.path || `02-products/${p.id.replace('product/', '')}`);
      let asset = { id: p.id, type: 'product', owner: p.owner, status: 'active', path: p.path, purpose: p.purpose || 'Sovereign Venture' };
      const assetFile = path.join(assetPath, 'asset.json');
      if (fs.existsSync(assetFile)) {
        try { asset = JSON.parse(fs.readFileSync(assetFile, 'utf8')); } catch {}
      }
      const readme = path.join(assetPath, 'README.md');
      asset.hasReadme = fs.existsSync(readme);
      return asset;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: Inbox ───────────────────────────────────────────────────────────────
app.get('/api/inbox', (req, res) => {
  try {
    const inboxDir = path.join(KOS_DIR, '00-inbox');
    const items = [];
    if (!fs.existsSync(inboxDir)) return res.json([]);
    fs.readdirSync(inboxDir).filter(f => f.endsWith('.md') && !f.startsWith('index') && !f.startsWith('README')).forEach(f => {
      const filePath = path.join(inboxDir, f);
      const content = fs.readFileSync(filePath, 'utf8');
      const fm = parseFrontmatter(content);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      items.push({
        file: f,
        filePath,
        title: titleMatch ? titleMatch[1].trim() : f,
        status: fm.status || 'pending',
        date: fm.date || f.slice(0, 8),
        content
      });
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: Backlog ─────────────────────────────────────────────────────────────
app.get('/api/backlog', (req, res) => {
  try {
    const tasks = [];
    const searchDirs = [
      path.join(KOS_DIR, '01-backlog'),
      ...getDirectories(path.join(KOS_DIR, '02-products')).map(d =>
        path.join(KOS_DIR, '02-products', d, '01-backlog')
      )
    ];
    searchDirs.forEach(dir => {
      if (!fs.existsSync(dir)) return;
      fs.readdirSync(dir).filter(f => f.startsWith('TASK-') && f.endsWith('.md')).forEach(f => {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        const fm = parseFrontmatter(content);
        const titleMatch = content.match(/^#\s+(.+)$/m);
        tasks.push({
          file: f,
          title: titleMatch ? titleMatch[1].trim() : f,
          status: fm.status || 'todo',
          type: fm.type || 'feature',
          priority: fm.priority || 'medium',
          owner: fm.owner || 'unassigned',
          id: fm.id || f
        });
      });
    });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: Plans ────────────────────────────────────────────────────────────────
app.get('/api/plans', (req, res) => {
  try {
    const plans = [];
    const productsDir = path.join(KOS_DIR, '02-products');
    if (!fs.existsSync(productsDir)) return res.json([]);
    getDirectories(productsDir).forEach(product => {
      const plansDir = path.join(productsDir, product, '03-engineering', 'plans');
      if (!fs.existsSync(plansDir)) return;
      fs.readdirSync(plansDir).filter(f => f.startsWith('PLAN-') && f.endsWith('.md')).forEach(f => {
        const filePath = path.join(plansDir, f);
        const content = fs.readFileSync(filePath, 'utf8');
        const fm = parseFrontmatter(content);
        const titleMatch = content.match(/^#\s+PLAN:\s*(.+)$/m);
        plans.push({
          file: f,
          filePath,
          title: titleMatch ? titleMatch[1].trim() : f,
          product,
          status: fm.status || 'draft',
          date: fm.date || f.slice(5, 13),
          content
        });
      });
    });
    res.json(plans);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: Stats ───────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(KOS_DIR, '04-protocols/core/registry.json'), 'utf8'));
    const products = registry.assets.filter(a => a.type === 'product').length;
    const inboxDir = path.join(KOS_DIR, '00-inbox');
    let inboxCount = 0;
    if (fs.existsSync(inboxDir)) {
      inboxCount = fs.readdirSync(inboxDir).filter(f => f.endsWith('.md') && !f.startsWith('index') && !f.startsWith('README')).length;
    }
    const tasks = [];
    const backlogDir = path.join(KOS_DIR, '01-backlog');
    if (fs.existsSync(backlogDir)) {
      fs.readdirSync(backlogDir).filter(f => f.startsWith('TASK-') && f.endsWith('.md')).forEach(f => {
        const content = fs.readFileSync(path.join(backlogDir, f), 'utf8');
        const fm = parseFrontmatter(content);
        tasks.push(fm.status || 'todo');
      });
    }
    res.json({
      products,
      inbox: inboxCount,
      tasks: { total: tasks.length, todo: tasks.filter(t => t === 'todo').length, doing: tasks.filter(t => t === 'doing').length, done: tasks.filter(t => t === 'done').length }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Serve React build ────────────────────────────────────────────────────────
const buildPath = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
  });
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[KOS Dashboard] API running on http://localhost:${PORT}`);
});

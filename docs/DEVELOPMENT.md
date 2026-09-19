# 开发说明

面向后续维护（包括未来的自己）。这是一个 Astro 静态站点，由 GitHub Actions 构建后发布到 GitHub Pages。

## 目录结构

| 路径                                                    | 作用                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/pages/`                                            | 路由入口：首页、文章、归档、实验室、统计、start、标签、RSS、搜索索引与 OG 图 |
| `src/components/`                                       | 可复用组件：导航、卡片、评论、OG 图                                          |
| `src/layouts/BaseLayout.astro`                          | 文档骨架与 canonical / OG / Twitter / JSON-LD 元信息                         |
| `src/styles/global.css`                                 | 全站视觉系统与响应式样式                                                     |
| `content/posts/`、`content/pages/`、`content/projects/` | Markdown 内容集合                                                            |
| `src/data/`                                             | 页面用到的小型结构化数据（精选阅读等）                                       |
| `scripts/`                                              | 构建期脚本（生成 OG PNG、生成字体子集）                                      |
| `public/`                                               | 静态文件（示意图等）                                                         |

## 内容约定

- 文章写在 `content/posts/`，frontmatter 由 `src/content.config.ts` 校验：`title`、可选 `subtitle`、`date`、`author`、`tags`、可选 `draft`、`featured`。schema 是 strict 的，多余字段会直接让构建失败
- start 页的「先读这三篇」读取 `featured: true`，取最新三篇；不足三篇时构建报错（不静默降级）
- 双语正文用 `.lang-zh` / `.lang-en` 块；显示与隐藏完全由 `src/styles/global.css` 的 `html[data-lang]` 规则控制，导航右上角的语言开关只负责切换 `data-lang` 并记入 localStorage（键名 `bruce-language`）。界面内联文案用 `.zh-only` / `.en-only`
- 阅读时长与累计字数在 `src/utils/reading-time.ts` 按语言分别估算（中文按汉字数、英文按词数），用 `.zh-only/.en-only` 双 span 随语言切换
- 标签页只为被至少 2 篇文章使用的标签生成（`src/utils/tags.ts` 的 `TAG_PAGE_MIN_POSTS`）；单篇标签在文章卡片与主题栏里渲染为不可点击的 chip，不会产生死链
- 个人简介在 `content/pages/about.zh.md` 与 `content/pages/about.en.md`
- 项目卡片在 `content/projects/`：`title`、`summaryZh`、`summaryEn`、`category`、`status`、`started`、可选 `link`
- 不要提交 `dist/`、`node_modules/`、`.astro/`、`.cache/`、`.env` 或任何密钥
- 能识别个人的信息（邮箱、社交账号、学校、全名）不要写进仓库

## 本地开发

```sh
npm ci          # 按 lock 文件安装依赖
npm run dev     # 本地开发服务器
npm run build   # 生产构建（astro build + 生成 OG PNG）
npx astro check # Astro / TypeScript 诊断
npm run preview # 预览 dist 产物
```

## 评论区（Giscus）

标识符不写死在代码里，改为从环境变量读取。复制 `.env.example` 为 `.env`（已被 gitignore 忽略）后填写：

| 变量                        | 用途                                                |
| --------------------------- | --------------------------------------------------- |
| `PUBLIC_GISCUS_REPO`        | `owner/name` 形式的仓库                             |
| `PUBLIC_GISCUS_REPO_ID`     | 仓库 node ID，来自 [giscus.app](https://giscus.app) |
| `PUBLIC_GISCUS_CATEGORY`    | 讨论分类名，默认 `Announcements`                    |
| `PUBLIC_GISCUS_CATEGORY_ID` | 分类 node ID，来自 [giscus.app](https://giscus.app) |

`PUBLIC_GISCUS_REPO`、`PUBLIC_GISCUS_REPO_ID`、`PUBLIC_GISCUS_CATEGORY_ID` 三者缺一时，评论区块整体隐藏，不会渲染出坏掉的组件。

部署时需要在 _Settings → Secrets and variables → Actions → Variables_ 配置同名四项，workflow 会把它们传进构建；没配置的话线上就不显示评论区。

## 站点配置

- `SITE_URL` 可覆盖 canonical、sitemap、RSS、`robots.txt` 使用的站点域名。GitHub Actions 里默认推导为 `https://<owner>.github.io`，本地默认 `http://localhost:4321`，因此仓库里不硬编码账号名
- `robots.txt` 由构建生成，跟随上面的域名
- `astro.config.mjs` 会自动判断属于 user site（`<owner>.github.io`，发布在根路径）还是 project site（发布在子路径）

## 界面字体

界面（导航、按钮、次级 UI 文案）使用小米的 **MiSans**。仓库里只放子集，所以文件约 100 KB 而不是 19 MB：

- `src/assets/fonts/misans-ui-subset.woff2` — 可变字体子集（字重 400–700），由 `src/styles/global.css` 引用
- 正文（`.prose`、标题、页面导语）仍使用系统衬线栈，小标签仍使用等宽栈，只有 `--sans` 指向 MiSans
- MiSans 可免费使用；官方对嵌入使用的要求是注明字体来源，因此关于页保留了一句署名（`content/pages/about.*.md`）

界面文案改动后重新生成子集：

```sh
pip install fonttools brotli   # 只需一次
npm run build:ui-font
```

脚本会从 `src/`、`content/projects/`、文章 frontmatter 收集字符，再把 MiSans VF 子集化到字重 400–700。子集之外的字符会回落到系统字体，如果将来某个标签显示异常，重跑一次即可。

## 背景与配色

全站是深色星空主题，配色集中在 `src/styles/global.css` 的 `:root`：`--paper` 页面底、`--ink` 主文字、`--muted` 次级文字、`--line` 分隔线、`--accent` 强调色，以及 `--surface` / `--surface-strong` / `--surface-hover` 三个卡片面层。换主题只要改这几个变量，不要在规则里直接写死颜色。

星空背景分两档自托管：

| 文件                                                       | 尺寸      | 用途          |
| ---------------------------------------------------------- | --------- | ------------- |
| `public/assets/backgrounds/artemis-ii-starfield-1920.webp` | 1920×1280 | 默认背景      |
| `public/assets/backgrounds/artemis-ii-starfield-1280.webp` | 1280×853  | ≤780px 的窄屏 |

由 `body::after` 固定铺满（`z-index: -2`），上面叠一层 `rgba(6, 6, 10, …)` 渐变保证文字对比度；`body::before` 是网格纹理。换图时保持同样的命名与两档尺寸即可。

照片来源为 NASA 图像库 `art002e012588`（Artemis II 乘组拍摄，2026-04-07），NASA 图像可自由使用，关于页保留了署名。替换背景图时请一并更新那行署名。

## 部署

推送到 `master` 会触发 `.github/workflows/deploy.yml`：先 `astro check` 与 `astro build`，再把 `dist/` 发布到 GitHub Pages。仓库设置里把 **Pages → Build and deployment → Source** 设为 **GitHub Actions**。

import type { Plugin } from 'vite';
import { builtInGames } from '../src/games';

const projectName = 'PolyGlot Arcade Tutor';
const authorName = 'Aarti S Ravikumar';
const authorUrl = 'https://ai-aarti.com/';
const repositoryUrl = 'https://github.com/aartisr/Polyglot-Arcade-Tutor';
const intro = 'Learn to build retro 2D games through interactive JavaScript lessons and Python and Java code examples.';
const description = `${intro} Created by ${authorName}.`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);
const escapeXml = escapeHtml;
const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
const plainText = (value: string) => value.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

export function discoveryPlugin(): Plugin {
  const origin = new URL(process.env.PUBLIC_SITE_URL || 'https://pat.pcssiirobotics.org').origin;
  if (!origin.startsWith('https://')) throw new Error('PUBLIC_SITE_URL must use HTTPS');
  const officialProduction = process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_GIT_PROVIDER === 'github'
    && process.env.VERCEL_GIT_REPO_OWNER === 'aartisr'
    && process.env.VERCEL_GIT_REPO_SLUG === 'Polyglot-Arcade-Tutor'
    && origin === 'https://pat.pcssiirobotics.org';
  const clarityProjectId = process.env.CLARITY_PROJECT_ID?.trim()
    || (officialProduction ? 'zafuff49tg' : undefined);
  if (clarityProjectId && !/^[a-zA-Z0-9]+$/.test(clarityProjectId)) {
    throw new Error('CLARITY_PROJECT_ID must contain only letters and numbers');
  }
  const clarityScript = clarityProjectId ? `<script>
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${clarityProjectId}");
</script>` : '';
  const absolute = (path: string) => `${origin}${path}`;
  const author = { '@type': 'Person', '@id': `${authorUrl}#person`, name: authorName, url: authorUrl };
  const guides = builtInGames.flatMap((game) => game.lessons.map((lesson) => ({
    game,
    lesson,
    path: `/discover/${game.id}/${lesson.id}.html`,
  })));

  const page = (title: string, summary: string, path: string, body: string, structuredData: unknown) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(summary)}">
<meta name="author" content="${authorName}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${absolute(path)}">
<meta property="og:type" content="${path === '/discover/' ? 'website' : 'article'}"><meta property="og:site_name" content="${projectName}">
<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(summary)}">
<meta property="og:url" content="${absolute(path)}"><meta property="og:image" content="${absolute('/social-card.png')}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonLd(structuredData)}</script>
${clarityScript}
<style>body{margin:0;background:#020b1c;color:#e5f0f8;font:16px/1.65 system-ui,sans-serif}main{max-width:850px;margin:auto;padding:3rem 1.25rem 5rem}a{color:#67e8f9}h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1.15}h2{margin-top:2rem}p,li{max-width:72ch}.eyebrow{color:#67e8f9;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:.8rem}.card{background:#0d1b30;border:1px solid #284158;border-radius:1rem;padding:1.25rem;margin:1rem 0}.steps{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}footer{border-top:1px solid #284158;margin-top:3rem;padding-top:1rem;color:#94a3b8;font-size:.75rem}footer a{color:inherit}footer a:hover{color:#67e8f9}</style>
</head><body><main>${body}<footer>By <a rel="author" href="${authorUrl}">${authorName}</a> · <a href="${repositoryUrl}">Source and citation</a> · <a href="https://aartisr.github.io/Polyglot-Arcade-Tutor/">GitHub Pages docs</a> · <a href="${repositoryUrl}/wiki">Wiki</a> · <a href="/">Open ${projectName}</a></footer></main></body></html>`;

  return {
    name: 'search-discovery',
    apply: 'build',
    transformIndexHtml(html) {
      const metadata = `
    <link rel="canonical" href="${absolute('/')}">
    <meta property="og:url" content="${absolute('/')}">
    <meta property="og:image" content="${absolute('/social-card.png')}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="PolyGlot Arcade Tutor, created by Aarti S Ravikumar">
    <meta name="twitter:image" content="${absolute('/social-card.png')}">
    ${clarityScript}
    <script type="application/ld+json">${jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        author,
        { '@type': 'WebSite', '@id': `${origin}/#website`, name: projectName, url: absolute('/'), author: { '@id': author['@id'] } },
        {
          '@type': 'WebApplication', '@id': `${origin}/#app`, name: projectName,
          url: absolute('/'), description, inLanguage: 'en',
          applicationCategory: 'EducationalApplication', operatingSystem: 'Web browser',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@id': author['@id'] }, creator: { '@id': author['@id'] },
          sameAs: repositoryUrl,
        },
      ],
    })}</script>`;
      return html.replace('</head>', `${metadata}\n  </head>`);
    },
    generateBundle() {
      const add = (fileName: string, source: string) => this.emitFile({ type: 'asset', fileName, source });
      const urls = ['/', '/discover/', ...guides.map(({ path }) => path)];
      add('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`);
      add('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${escapeXml(absolute(path))}</loc></url>`).join('\n')}\n</urlset>\n`);

      const hubBody = `<p class="eyebrow">Learn game development</p><h1>${projectName}</h1>
<p>${intro}</p>
<p>Play a finished game, then follow four short lessons in each game. JavaScript runs on the browser canvas. Python and Java are code comparison views with simulated previews.</p>
<p><a href="/">Launch the interactive tutor</a> · <a href="https://aartisr.github.io/Polyglot-Arcade-Tutor/">Read GitHub Pages docs</a> · <a href="${repositoryUrl}/wiki">Visit the Wiki</a> · <a href="${repositoryUrl}">View the open source repository</a></p>
<h2>Games and lessons</h2>${builtInGames.map((game) => `<section class="card"><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.description)}</p><ol>${game.lessons.map((lesson) => `<li><a href="/discover/${encodeURIComponent(game.id)}/${encodeURIComponent(lesson.id)}.html">Step ${lesson.stepNumber}: ${escapeHtml(lesson.title)}</a></li>`).join('')}</ol></section>`).join('')}
<h2>Quick answers</h2><div class="card"><h3>Can I play the finished games?</h3><p>Yes. Use Play game in the tutor. After the final lesson, Download game saves a standalone HTML file with touch controls.</p></div>`;
      add('discover/index.html', page(`${projectName} | Game development lessons`, description, '/discover/', hubBody, {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: projectName,
        url: absolute('/discover/'), description, author,
        hasPart: guides.map(({ path }) => ({ '@type': 'LearningResource', url: absolute(path) })),
      }));

      for (const { game, lesson, path } of guides) {
        const summary = `Step ${lesson.stepNumber} of ${game.title} by ${authorName}. ${plainText(lesson.description).slice(0, 145)}`;
        const title = `${lesson.title} | ${projectName}`;
        const body = `<p class="eyebrow">${escapeHtml(game.title)} · Step ${lesson.stepNumber} of ${game.lessons.length}</p>
<h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(plainText(lesson.description))}</p>
<div class="card"><h2>What you will learn</h2><ul>${lesson.concepts.map((concept) => `<li><strong>${escapeHtml(concept.title)}</strong>: ${escapeHtml(concept.description)}</li>`).join('')}</ul></div>
<p><a href="/tutor/${encodeURIComponent(lesson.id)}?game=${encodeURIComponent(game.id)}">Open this interactive lesson</a> · <a href="/discover/">Browse all lessons</a></p>
<p>In the editor, complete the marked TODOs. Use Stuck on a TODO? to reveal hints or a worked example, then run the lesson checks.</p>`;
        add(path.slice(1), page(title, summary, path, body, {
          '@context': 'https://schema.org', '@type': 'LearningResource', name: lesson.title,
          url: absolute(path), description: plainText(lesson.description), inLanguage: 'en',
          learningResourceType: 'Interactive coding lesson', author,
          isPartOf: { '@type': 'WebSite', name: projectName, url: absolute('/') },
          teaches: lesson.concepts.map((concept) => concept.title),
        }));
      }

      add('llms.txt', `# ${projectName}\n\n> ${description}\n\nAuthor: ${authorName}\nAuthor profile: ${authorUrl}\nCanonical app: ${absolute('/')}\nSource and citation: ${repositoryUrl}\n\n## What this site offers\n\n- ${builtInGames.length} game paths: ${builtInGames.map((game) => game.title).join('; ')}.\n- ${guides.length} lessons with starter code, progressive hints, worked examples, and checks.\n- JavaScript executes in the browser. Python and Java are comparison views with simulated previews.\n- Completed reference games can be played and downloaded as standalone HTML files.\n\n## Browse\n\n- [Project and lesson guide](${absolute('/discover/')})\n${guides.map(({ game, lesson, path }) => `- [${game.title}, step ${lesson.stepNumber}: ${lesson.title}](${absolute(path)})`).join('\n')}\n\nFor attribution, cite ${authorName} and link to the source repository or canonical app.\n`);
    },
  };
}

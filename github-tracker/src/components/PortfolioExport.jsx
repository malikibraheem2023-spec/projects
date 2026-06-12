export default function PortfolioExport({ user, repos }) {
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  const langs = {}
  repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1 })
  const topLangs = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([l]) => l)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${user.name || user.login} — Portfolio</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0d1117;color:#e6edf3;margin:0;padding:32px}
  .container{max-width:860px;margin:0 auto}
  .header{display:flex;gap:24px;align-items:center;margin-bottom:40px}
  img{width:96px;height:96px;border-radius:50%;border:3px solid #7c3aed}
  h1{margin:0;font-size:2rem}
  .sub{color:#7c3aed;margin:4px 0}
  .bio{color:#8b949e;font-size:.9rem;margin-top:4px}
  .stats{display:flex;gap:32px;margin:16px 0}
  .stat{text-align:center}
  .stat-val{font-size:1.5rem;font-weight:700;color:#7c3aed}
  .stat-lbl{font-size:.75rem;color:#8b949e}
  h2{border-bottom:1px solid #21262d;padding-bottom:8px;color:#c9d1d9}
  .repos{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin:16px 0}
  .repo{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px}
  .repo-name{color:#7c3aed;font-weight:600;text-decoration:none;display:block;margin-bottom:6px}
  .repo-name:hover{text-decoration:underline}
  .repo-desc{font-size:.8rem;color:#8b949e;margin-bottom:8px;min-height:32px}
  .tags{display:flex;gap:8px;font-size:.75rem;color:#8b949e}
  .langs{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
  .lang{background:#21262d;padding:4px 12px;border-radius:20px;font-size:.8rem}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <img src="${user.avatar_url}" alt="${user.login}"/>
    <div>
      <h1>${user.name || user.login}</h1>
      <p class="sub">@${user.login}</p>
      ${user.bio ? `<p class="bio">${user.bio}</p>` : ''}
      ${user.location ? `<p class="bio">📍 ${user.location}</p>` : ''}
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${user.public_repos}</div><div class="stat-lbl">Repos</div></div>
    <div class="stat"><div class="stat-val">${user.followers}</div><div class="stat-lbl">Followers</div></div>
    <div class="stat"><div class="stat-val">${user.following}</div><div class="stat-lbl">Following</div></div>
  </div>
  <h2>Top Languages</h2>
  <div class="langs">${topLangs.map((l) => `<span class="lang">${l}</span>`).join('')}</div>
  <h2>Top Repositories</h2>
  <div class="repos">
    ${topRepos.map((r) => `
    <div class="repo">
      <a class="repo-name" href="${r.html_url}" target="_blank">${r.name}</a>
      <p class="repo-desc">${r.description || 'No description'}</p>
      <div class="tags">
        ${r.language ? `<span>${r.language}</span>` : ''}
        <span>⭐ ${r.stargazers_count}</span>
        <span>🍴 ${r.forks_count}</span>
      </div>
    </div>`).join('')}
  </div>
</div>
</body>
</html>`

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${user.login}-portfolio.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={download}
      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
    >
      ⬇ Export Portfolio HTML
    </button>
  )
}

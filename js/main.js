// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Load papers if a papers container exists on this page
  const selectedWorkContainer = document.getElementById('selected-work');
  const researchContainer = document.getElementById('research-papers');

  if (selectedWorkContainer || researchContainer) {
    fetch('data/papers.json')
      .then(r => r.json())
      .then(papers => {
        if (selectedWorkContainer) {
          renderSelectedWork(papers, selectedWorkContainer);
        }
        if (researchContainer) {
          renderResearchPapers(papers, researchContainer);
        }
      })
      .catch(err => console.error('Failed to load papers:', err));
  }
});

function renderPaperHTML(paper, showAbstract) {
  const venueText = [paper.venue, paper.year].filter(Boolean).join(', ');
  const venue = venueText ? `<p class="paper-venue">${venueText}</p>` : '';
  const titleLink = paper.url && paper.url !== '#'
    ? `<a href="${paper.url}" target="_blank" rel="noopener">${paper.title}</a>`
    : paper.title;

  let abstract = '';
  if (showAbstract && paper.abstract) {
    abstract = `
      <details>
        <summary>Abstract</summary>
        <p>${paper.abstract}</p>
      </details>`;
  }

  let links = [];
  if (paper.url && paper.url !== '#') links.push(`<a href="${paper.url}" target="_blank" rel="noopener">Paper</a>`);
  if (paper.pdf && paper.pdf !== '#') links.push(`<a href="${paper.pdf}" target="_blank" rel="noopener">PDF</a>`);
  const linksHTML = links.length ? `<div class="paper-links">${links.join(' ')}</div>` : '';

  return `
    <div class="paper">
      <p class="paper-title">${titleLink}</p>
      <p class="paper-authors">${paper.authors}</p>
      ${venue}
      ${abstract}
      ${linksHTML}
    </div>`;
}

function renderSelectedWork(papers, container) {
  const selected = papers.filter(p => p.selected);
  if (selected.length === 0) return;

  container.innerHTML = selected.map(p => renderPaperHTML(p, false)).join('');
}

function renderResearchPapers(papers, container) {
  const categories = [
    { key: 'publications', label: 'Publications' },
    { key: 'working-papers', label: 'Working Papers' },
    { key: 'works-in-progress', label: 'Works in Progress' },
    { key: 'policy', label: 'Policy Writing' }
  ];

  let html = '';
  for (const cat of categories) {
    const catPapers = papers.filter(p => p.category === cat.key);
    if (catPapers.length === 0) continue;

    html += `
      <div class="research-section">
        <h2>${cat.label}</h2>
        ${catPapers.map(p => renderPaperHTML(p, true)).join('')}
      </div>`;
  }

  container.innerHTML = html;
}

import { loadContent, escape, rich, period, fillFields } from './content.js';

const content = await loadContent();
fillFields(content);
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('theme').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark'
    || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

if (content.cv) document.getElementById('cv-top').href = content.cv;

const now = content.current;
document.getElementById('now').innerHTML = now ? `
  <p class="now-label">Currently</p>
  ${now.logo ? `
  <img class="logo logo-light" src="${escape(now.logo.light)}" alt="${escape(now.company)}">
  <img class="logo logo-dark" src="${escape(now.logo.dark)}" alt="" aria-hidden="true">` : `<h3>${escape(now.company)}</h3>`}
  <p class="now-role">${escape(now.role)}</p>
  <p class="now-since">Since ${escape(now.since)}</p>
  <p class="now-text">${escape(now.summary)}</p>` : '';

document.getElementById('about-text').innerHTML = (content.about ?? []).map(paragraph =>
  `<p>${rich(paragraph)}</p>`
).join('');

document.getElementById('skills').innerHTML = (content.skills ?? []).map(skill =>
  `<span>${escape(skill)}</span>`
).join('');

document.getElementById('jobs').innerHTML = (content.experience ?? []).map(job => `
  <li>
    <p class="when">${escape(period(job))}</p>
    <div>
      <h3>${escape(job.company)}</h3>
      <p class="sub">${escape(job.role)}</p>
      ${job.summary ? `<p class="job-summary">${rich(job.summary)}</p>` : ''}
      <ul>${(job.points ?? []).map(point => `<li>${rich(point)}</li>`).join('')}</ul>
    </div>
  </li>`
).join('');

document.getElementById('schools').innerHTML = (content.education ?? []).map(school => `
  <li>
    <p class="when">${escape(period(school))}</p>
    <div>
      <h3>${escape(school.degree)}</h3>
      <p class="sub">${escape(school.school)}${school.location ? `, ${escape(school.location)}` : ''}</p>
      ${school.grade ? `<p class="grade">Grade ${escape(school.grade)}</p>` : ''}
      ${school.thesis ? `<p class="thesis">Thesis: <a href="${escape(school.thesis.url)}">${escape(school.thesis.title)}</a></p>` : ''}
    </div>
  </li>`
).join('');

const email = document.getElementById('email');
email.textContent = content.email ?? '';
email.href = content.email ? `mailto:${content.email}` : '#';

const contactLinks = [...(content.links ?? []), content.cv && { label: 'CV (PDF)', url: content.cv }].filter(Boolean);
document.getElementById('contact-links').innerHTML = contactLinks.map(link =>
  `<a href="${escape(link.url)}"><span>${escape(link.label)}</span><span class="arrow" aria-hidden="true">↗</span></a>`
).join('');

// Fades each block in as it scrolls into view; content stays visible if this never runs.
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  reveal.unobserve(entry.target);
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.section h2, .prose, .skills, .rows > li, .contact > *').forEach(element => {
  element.classList.add('reveal');
  reveal.observe(element);
});

// Local time in Porto, so visitors know when a reply is likely.
const clock = document.getElementById('clock');
const portoTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
const tick = () => { clock.textContent = portoTime.format(new Date()); };
tick();
setInterval(tick, 15000);
